import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  /** `user` represents an authenticated account that has not yet selected a marketplace role. */
  role: mysqlEnum("role", ["user", "client", "freelancer", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const marketplaceProjects = mysqlTable("marketplace_projects", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  budget: varchar("budget", { length: 80 }).notNull(),
  deadline: varchar("deadline", { length: 80 }).notNull(),
  description: text("description").notNull(),
  skills: text("skills").notNull(),
  status: mysqlEnum("status", ["open", "closed", "completed"]).default("open").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const marketplaceProposals = mysqlTable("marketplace_proposals", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  freelancerName: varchar("freelancerName", { length: 160 }).notNull(),
  contact: varchar("contact", { length: 320 }).notNull(),
  expectedBudget: varchar("expectedBudget", { length: 80 }).notNull(),
  coverLetter: text("coverLetter").notNull(),
  status: mysqlEnum("status", ["submitted", "accepted", "rejected", "completed"]).default("submitted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const marketplaceReviews = mysqlTable("marketplace_reviews", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  proposalId: int("proposalId").notNull(),
  clientId: int("clientId").notNull(),
  freelancerId: int("freelancerId").notNull(),
  rating: int("rating").notNull(),
  feedback: text("feedback").notNull(),
  verified: boolean("verified").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MarketplaceProject = typeof marketplaceProjects.$inferSelect;
export type MarketplaceProposal = typeof marketplaceProposals.$inferSelect;
export type MarketplaceReview = typeof marketplaceReviews.$inferSelect;
