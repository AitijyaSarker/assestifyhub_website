import mongoose from "mongoose";
import { 
  Settings, 
  Service, 
  TechStack, 
  Project, 
  BlogPost, 
  Lead, 
  AuditLog 
} from "../models.js";

class DBRepository {
  public async getSettings() {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = await Settings.create({
        brandName: "Assestify Hub",
        tagline: "Architecting your digital future.",
        logoUrlLight: "/favicon.svg",
        logoUrlDark: "/favicon.svg",
        contactEmail: "welisten@assetify.com",
        contactPhone: "+1 (800) 555-2773",
        address: "Purabi -10, Bagabari, sylhet City, Sylhet, bangladesh",
        socialLinks: {
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
          facebook: "https://www.facebook.com/profile.php?id=61583933039295",
          github: "https://github.com",
        },
        themeDefault: "light",
        analyticsId: "G-ASSETIFY2026",
      });
    }
    return settings;
  }

  public async updateSettings(newSettings: any) {
    const settings = await Settings.findOne({});
    if (settings) {
      Object.assign(settings, newSettings);
      await settings.save();
      return settings;
    }
    return null;
  }

  public async getServices() {
    return await Service.find({}).sort({ order: 1 });
  }

  public async saveService(serviceData: any) {
    if (serviceData.id && mongoose.Types.ObjectId.isValid(serviceData.id)) {
      return await Service.findByIdAndUpdate(serviceData.id, serviceData, { new: true });
    } else {
      delete serviceData.id;
      return await Service.create(serviceData);
    }
  }

  public async deleteService(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Service.findByIdAndDelete(id);
    }
  }

  public async getTechStack() {
    return await TechStack.find({}).sort({ order: 1 });
  }

  public async saveTechStack(itemData: any) {
    if (itemData.id && mongoose.Types.ObjectId.isValid(itemData.id)) {
      return await TechStack.findByIdAndUpdate(itemData.id, itemData, { new: true });
    } else {
      delete itemData.id;
      return await TechStack.create(itemData);
    }
  }

  public async deleteTechStack(id: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      await TechStack.findByIdAndDelete(id);
    }
  }

  public async getProjects() {
    return await Project.find({}).sort({ order: 1 });
  }

  public async getBlogPosts() {
    return await BlogPost.find({}).sort({ publishedAt: -1 });
  }

  public async getLeads() {
    return await Lead.find({}).sort({ createdAt: -1 });
  }

  public async addLead(leadData: any) {
    return await Lead.create(leadData);
  }

  public async updateLeadStatus(id: string, status: string) {
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await Lead.findByIdAndUpdate(id, { status }, { new: true });
    }
    return null;
  }

  public async getAuditLogs() {
    return await AuditLog.find({}).sort({ timestamp: -1 });
  }

  public async logAction(userEmail: string, action: string, details: string) {
    return await AuditLog.create({ userEmail, action, details });
  }
}

export const dbRepository = new DBRepository();
