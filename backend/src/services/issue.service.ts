import { Status, Priority } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "../lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export class IssueService {
  /**
   * Scopes all queries to the tenantId for security.
   */
  static async getIssues(tenantId: string) {
    return prisma.issue.findMany({
      where: { tenantId },
      include: {
        reporter: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async createIssue(data: {
    title: string;
    description?: string;
    priority?: Priority;
    tenantId: string;
    reporterId: string;
  }) {
    // 1. Auto-categorize using Gemini
    let category = "Uncategorized";
    try {
      if (process.env.GEMINI_API_KEY) {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
        });

        const prompt = `Categorize this software issue into ONE word (e.g., Bug, Feature, UI, Backend, Security, Performance). 
        Title: ${data.title}
        Description: ${data.description || "No description provided"}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        category = response.text().trim();
      }
    } catch (error) {
      console.error("[AI Service Error]:", error);
    }

    // 2. Verify reporter exists
    const reporter = await prisma.user.findUnique({
      where: { id: data.reporterId },
    });
    if (!reporter) throw new Error("Reporter not found");

    // 3. Create in DB with tenant scoping
    return prisma.issue.create({
      data: {
        ...data,
        category,
      },
    });
  }

  static async getIssueById(id: string, tenantId: string) {
    return prisma.issue.findFirst({
      where: { id, tenantId },
      include: {
        reporter: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
      },
    });
  }

  static async updateIssue(id: string, tenantId: string, data: any) {
    // Validate the issue belongs to the tenant before updating
    const existing = await this.getIssueById(id, tenantId);
    if (!existing) throw new Error("Issue not found or unauthorized");

    return prisma.issue.update({
      where: { id },
      data,
    });
  }

  static async deleteIssue(id: string, tenantId: string) {
    const existing = await this.getIssueById(id, tenantId);
    if (!existing) throw new Error("Issue not found or unauthorized");

    return prisma.issue.delete({
      where: { id },
    });
  }
}
