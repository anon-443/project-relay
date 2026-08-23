import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, marketplaceProjects, marketplaceProposals, marketplaceReviews, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** Persist an authenticated account's self-selected marketplace role. */
export async function setMarketplaceRole(userId: number, role: "client" | "freelancer") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

function decodeSkills(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((skill) => typeof skill === "string") ? parsed : [];
  } catch {
    return [];
  }
}

function presentProject(project: typeof marketplaceProjects.$inferSelect) {
  return { ...project, skills: decodeSkills(project.skills) };
}

export type CreateMarketplaceProjectInput = {
  clientId: number;
  clientName: string;
  title: string;
  category: string;
  budget: string;
  deadline: string;
  description: string;
  skills: string[];
};

export async function createMarketplaceProject(input: CreateMarketplaceProjectInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const result = await db.insert(marketplaceProjects).values({ ...input, skills: JSON.stringify(input.skills) });
  const [project] = await db.select().from(marketplaceProjects).where(eq(marketplaceProjects.id, Number(result[0].insertId))).limit(1);
  if (!project) throw new Error("The project could not be saved.");
  return presentProject(project);
}

export async function getMarketplaceProject(projectId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const [project] = await db.select().from(marketplaceProjects).where(eq(marketplaceProjects.id, projectId)).limit(1);
  return project ? presentProject(project) : undefined;
}

export async function listOpenMarketplaceProjects() {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const projects = await db.select().from(marketplaceProjects).where(eq(marketplaceProjects.status, "open")).orderBy(desc(marketplaceProjects.createdAt));
  return projects.map(presentProject);
}

export async function listClientMarketplaceProjects(clientId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const projects = await db.select().from(marketplaceProjects).where(eq(marketplaceProjects.clientId, clientId)).orderBy(desc(marketplaceProjects.createdAt));
  return projects.map(presentProject);
}

export type CreateMarketplaceProposalInput = {
  projectId: number;
  freelancerId: number;
  freelancerName: string;
  contact: string;
  expectedBudget: string;
  coverLetter: string;
};

export async function createMarketplaceProposal(input: CreateMarketplaceProposalInput) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const result = await db.insert(marketplaceProposals).values(input);
  const [proposal] = await db.select().from(marketplaceProposals).where(eq(marketplaceProposals.id, Number(result[0].insertId))).limit(1);
  if (!proposal) throw new Error("The proposal could not be saved.");
  return proposal;
}

export async function getMarketplaceProposal(proposalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const [proposal] = await db.select().from(marketplaceProposals).where(eq(marketplaceProposals.id, proposalId)).limit(1);
  return proposal;
}

export async function listClientMarketplaceProposals(clientId: number) {
  const projects = await listClientMarketplaceProjects(clientId);
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const rows = await Promise.all(projects.map(async (project) => {
    const proposals = await db.select().from(marketplaceProposals).where(eq(marketplaceProposals.projectId, project.id)).orderBy(desc(marketplaceProposals.createdAt));
    return proposals.map((proposal) => ({ ...proposal, project }));
  }));
  return rows.flat();
}

export async function listFreelancerMarketplaceProposals(freelancerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const proposals = await db.select().from(marketplaceProposals).where(eq(marketplaceProposals.freelancerId, freelancerId)).orderBy(desc(marketplaceProposals.createdAt));
  const rows = await Promise.all(proposals.map(async (proposal) => ({ proposal, project: await getMarketplaceProject(proposal.projectId) })));
  return rows.filter((row): row is { proposal: typeof proposals[number]; project: NonNullable<Awaited<ReturnType<typeof getMarketplaceProject>>> } => Boolean(row.project));
}

export async function setMarketplaceProposalStatus(proposalId: number, status: "accepted" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  await db.update(marketplaceProposals).set({ status }).where(eq(marketplaceProposals.id, proposalId));
}

export async function setMarketplaceProjectStatus(projectId: number, status: "closed" | "completed") {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  await db.update(marketplaceProjects).set({ status }).where(eq(marketplaceProjects.id, projectId));
}

export async function getMarketplaceReviewForProposal(proposalId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const [review] = await db.select().from(marketplaceReviews).where(eq(marketplaceReviews.proposalId, proposalId)).limit(1);
  return review;
}

export async function createMarketplaceReview(input: { projectId: number; proposalId: number; clientId: number; freelancerId: number; rating: number; feedback: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  const result = await db.insert(marketplaceReviews).values(input);
  const [review] = await db.select().from(marketplaceReviews).where(eq(marketplaceReviews.id, Number(result[0].insertId))).limit(1);
  if (!review) throw new Error("The review could not be saved.");
  return review;
}

export async function listFreelancerMarketplaceReviews(freelancerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Please try again shortly.");
  return db.select().from(marketplaceReviews).where(eq(marketplaceReviews.freelancerId, freelancerId)).orderBy(desc(marketplaceReviews.createdAt));
}
