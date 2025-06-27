import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertOrderSchema, insertInvoiceSchema, insertChatMessageSchema, insertSettingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email sudah terdaftar!" });
      }

      const user = await storage.createUser(userData);
      res.json({ message: "Pendaftaran berhasil! Silakan tunggu persetujuan admin.", user });
    } catch (error) {
      res.status(400).json({ message: "Data tidak valid", error });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Admin login
      if (email === 'id.arvinstudio@gmail.com' && password === 'Bandung123') {
        return res.json({ 
          user: { email, role: 'admin', fullName: 'Admin' }, 
          role: 'admin' 
        });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Email atau password salah!" });
      }

      if (user.status === "pending") {
        return res.status(403).json({ message: "Mohon Bersabar Karena Admin Sedang Memeriksa Permintaan Kamu Terlebih Dahulu." });
      }

      if (user.status === "rejected") {
        return res.status(403).json({ message: "Maaf, pendaftaran kamu ditolak. Silakan hubungi admin via WhatsApp." });
      }

      res.json({ user, role: 'user' });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // User Management Routes
  app.get("/api/users/pending", async (req, res) => {
    try {
      const pendingUsers = await storage.getUsersByStatus("pending");
      res.json(pendingUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/users/:id/approve", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.updateUserStatus(userId, "approved");
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      res.json({ message: "User berhasil disetujui", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/users/:id/reject", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.updateUserStatus(userId, "rejected");
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }
      res.json({ message: "User berhasil ditolak", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Order Routes
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json({ message: "Pesanan berhasil dibuat", order });
    } catch (error) {
      res.status(400).json({ message: "Data pesanan tidak valid", error });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/orders/user/:email", async (req, res) => {
    try {
      const userEmail = req.params.email;
      const orders = await storage.getOrdersByUserEmail(userEmail);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/orders/:id/price", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { price } = req.body;
      const order = await storage.updateOrderPrice(orderId, price);
      if (!order) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan" });
      }
      res.json({ message: "Harga berhasil diset", order });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/orders/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(orderId, status);
      if (!order) {
        return res.status(404).json({ message: "Pesanan tidak ditemukan" });
      }
      res.json({ message: "Status berhasil diupdate", order });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Invoice Routes
  app.post("/api/invoices", async (req, res) => {
    try {
      const invoiceData = insertInvoiceSchema.parse(req.body);
      const invoice = await storage.createInvoice(invoiceData);
      res.json({ message: "Invoice berhasil dibuat", invoice });
    } catch (error) {
      res.status(400).json({ message: "Data invoice tidak valid", error });
    }
  });

  app.get("/api/invoices/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const invoices = await storage.getInvoicesByUserId(userId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/invoices/order/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      const invoice = await storage.getInvoiceByOrderId(orderId);
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Chat Routes
  app.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(messageData);
      res.json({ message: "Pesan berhasil dikirim", data: message });
    } catch (error) {
      res.status(400).json({ message: "Data pesan tidak valid", error });
    }
  });

  app.get("/api/chat/messages", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/chat/messages/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // Settings Routes
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      let setting = await storage.getSetting(key);
      
      // Create default settings if they don't exist
      if (!setting) {
        let defaultValue = "";
        if (key === "marqueText") {
          defaultValue = "🎉 SELAMAT DATANG DI ARVIN PROFESSIONAL EDITING! ✨ Solusi Kreatif Terbaik untuk Kebutuhan Digital Anda! 🚀";
        }
        setting = await storage.setSetting(key, defaultValue);
      }
      
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const { key, value } = req.body;
      const setting = await storage.setSetting(key, value);
      res.json({ message: "Setting berhasil disimpan", setting });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.get("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSetting(key);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  app.post("/api/settings/:key", async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const setting = await storage.setSetting(key, value);
      res.json({ message: "Setting berhasil disimpan", setting });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
