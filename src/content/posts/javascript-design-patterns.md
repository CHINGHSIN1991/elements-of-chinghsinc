---
id: "javascript-design-patterns"
title: "JavaScript 設計模式：提升代碼質量的實用技巧"
description: "深入探討 JavaScript 中常用的設計模式，包含實際代碼範例和應用場景，幫助開發者寫出更優雅、可維護的代碼"
date: "2024-02-28"
author: "張志明"
image: 
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    alt: "JavaScript 代碼編輯器"
draft: false
category: "web"
tags: ["JavaScript", "設計模式", "程式設計", "代碼品質", "軟體架構"]
---

設計模式是軟體開發中的經典解決方案，它們提供了處理常見問題的標準化方法。在 JavaScript 開發中，掌握這些設計模式不僅能提高代碼質量，還能讓我們的應用更加健壯和可維護。

## 單例模式（Singleton Pattern）

單例模式確保一個類別只有一個實例，並提供全局訪問點。這在管理應用狀態、配置或資源時非常有用：

```javascript
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connectionString = 'mongodb://localhost:27017/myapp';
    this.isConnected = false;
    DatabaseConnection.instance = this;
  }
  
  async connect() {
    if (this.isConnected) {
      console.log('Already connected to database');
      return;
    }
    
    try {
      // 模擬資料庫連接
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isConnected = true;
      console.log('Connected to database successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
    }
  }
  
  disconnect() {
    this.isConnected = false;
    console.log('Disconnected from database');
  }
}

// 使用範例
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log(db1 === db2); // true - 同一個實例

// 現代 JavaScript 的單例實現
const ConfigManager = (() => {
  let instance = null;
  
  return {
    getInstance() {
      if (!instance) {
        instance = {
          apiUrl: 'https://api.example.com',
          timeout: 5000,
          retries: 3,
          getConfig() {
            return {
              apiUrl: this.apiUrl,
              timeout: this.timeout,
              retries: this.retries
            };
          }
        };
      }
      return instance;
    }
  };
})();
```

## 觀察者模式（Observer Pattern）

觀察者模式定義了對象間的一對多依賴關係，當一個對象狀態改變時，所有依賴它的對象都會收到通知：

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  // 訂閱事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  
  // 取消訂閱
  off(eventName, callback) {
    if (!this.events[eventName]) return;
    
    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }
  
  // 觸發事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(callback => {
      callback(...args);
    });
  }
  
  // 一次性訂閱
  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args);
      this.off(eventName, onceCallback);
    };
    this.on(eventName, onceCallback);
  }
}

// 使用範例
const eventBus = new EventEmitter();

// 訂閱者
const logger = {
  log(message) {
    console.log(`[LOG] ${new Date().toISOString()}: ${message}`);
  }
};

const notifier = {
  sendNotification(message) {
    console.log(`[NOTIFICATION] ${message}`);
  }
};

// 訂閱事件
eventBus.on('user-login', logger.log);
eventBus.on('user-login', notifier.sendNotification);

// 觸發事件
eventBus.emit('user-login', 'User john_doe logged in successfully');

// 實際應用：購物車系統
class ShoppingCart {
  constructor() {
    this.items = [];
    this.eventEmitter = new EventEmitter();
  }
  
  addItem(item) {
    this.items.push(item);
    this.eventEmitter.emit('item-added', item, this.items.length);
    this.eventEmitter.emit('cart-updated', this.items);
  }
  
  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.eventEmitter.emit('item-removed', itemId, this.items.length);
    this.eventEmitter.emit('cart-updated', this.items);
  }
  
  getTotal() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}
```

## 工廠模式（Factory Pattern）

工廠模式提供了一個創建對象的接口，而不需要指定具體的類別。這讓代碼更加靈活和可擴展：

```javascript
// 抽象產品類別
class Vehicle {
  constructor(type, brand, model) {
    this.type = type;
    this.brand = brand;
    this.model = model;
  }
  
  start() {
    throw new Error('start() method must be implemented');
  }
  
  stop() {
    throw new Error('stop() method must be implemented');
  }
}

// 具體產品類別
class Car extends Vehicle {
  constructor(brand, model) {
    super('car', brand, model);
    this.wheels = 4;
  }
  
  start() {
    console.log(`${this.brand} ${this.model} car started with key ignition`);
  }
  
  stop() {
    console.log(`${this.brand} ${this.model} car stopped`);
  }
  
  drive() {
    console.log(`Driving ${this.brand} ${this.model} on the road`);
  }
}

class Motorcycle extends Vehicle {
  constructor(brand, model) {
    super('motorcycle', brand, model);
    this.wheels = 2;
  }
  
  start() {
    console.log(`${this.brand} ${this.model} motorcycle started with kick start`);
  }
  
  stop() {
    console.log(`${this.brand} ${this.model} motorcycle stopped`);
  }
  
  ride() {
    console.log(`Riding ${this.brand} ${this.model} motorcycle`);
  }
}

class Truck extends Vehicle {
  constructor(brand, model) {
    super('truck', brand, model);
    this.wheels = 6;
    this.cargoCapacity = 'Heavy';
  }
  
  start() {
    console.log(`${this.brand} ${this.model} truck started with air brake release`);
  }
  
  stop() {
    console.log(`${this.brand} ${this.model} truck stopped with air brakes`);
  }
  
  loadCargo() {
    console.log(`Loading cargo into ${this.brand} ${this.model} truck`);
  }
}

// 工廠類別
class VehicleFactory {
  static createVehicle(type, brand, model) {
    switch (type.toLowerCase()) {
      case 'car':
        return new Car(brand, model);
      case 'motorcycle':
        return new Motorcycle(brand, model);
      case 'truck':
        return new Truck(brand, model);
      default:
        throw new Error(`Unknown vehicle type: ${type}`);
    }
  }
  
  // 靜態工廠方法
  static createCar(brand, model) {
    return new Car(brand, model);
  }
  
  static createMotorcycle(brand, model) {
    return new Motorcycle(brand, model);
  }
  
  static createTruck(brand, model) {
    return new Truck(brand, model);
  }
}

// 使用範例
const vehicles = [
  VehicleFactory.createVehicle('car', 'Toyota', 'Camry'),
  VehicleFactory.createVehicle('motorcycle', 'Honda', 'CBR600'),
  VehicleFactory.createVehicle('truck', 'Ford', 'F-150')
];

vehicles.forEach(vehicle => {
  vehicle.start();
  if (vehicle.type === 'car') vehicle.drive();
  if (vehicle.type === 'motorcycle') vehicle.ride();
  if (vehicle.type === 'truck') vehicle.loadCargo();
  vehicle.stop();
  console.log('---');
});
```

## 模組模式（Module Pattern）

模組模式提供了封裝和私有性，是 JavaScript 中非常常用的模式：

```javascript
// 基本模組模式
const UserModule = (() => {
  // 私有變數
  let users = [];
  let currentUser = null;
  
  // 私有方法
  const validateUser = (user) => {
    return user && user.email && user.password;
  };
  
  const hashPassword = (password) => {
    // 簡化的密碼雜湊（實際應用中應使用更安全的方法）
    return btoa(password);
  };
  
  // 公開 API
  return {
    // 註冊用戶
    register(userData) {
      if (!validateUser(userData)) {
        throw new Error('Invalid user data');
      }
      
      const user = {
        id: Date.now(),
        email: userData.email,
        password: hashPassword(userData.password),
        name: userData.name,
        createdAt: new Date()
      };
      
      users.push(user);
      return user;
    },
    
    // 登入
    login(email, password) {
      const user = users.find(u => u.email === email);
      if (user && user.password === hashPassword(password)) {
        currentUser = user;
        return user;
      }
      throw new Error('Invalid credentials');
    },
    
    // 登出
    logout() {
      currentUser = null;
    },
    
    // 獲取當前用戶
    getCurrentUser() {
      return currentUser ? { ...currentUser } : null;
    },
    
    // 獲取用戶列表（僅管理員）
    getAllUsers() {
      if (!currentUser || currentUser.email !== 'admin@example.com') {
        throw new Error('Unauthorized');
      }
      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }));
    }
  };
})();

// 使用範例
try {
  const user1 = UserModule.register({
    email: 'john@example.com',
    password: 'password123',
    name: 'John Doe'
  });
  
  console.log('User registered:', user1);
  
  const loggedInUser = UserModule.login('john@example.com', 'password123');
  console.log('User logged in:', loggedInUser);
  
  console.log('Current user:', UserModule.getCurrentUser());
  
  UserModule.logout();
  console.log('After logout:', UserModule.getCurrentUser());
  
} catch (error) {
  console.error('Error:', error.message);
}
```

## 策略模式（Strategy Pattern）

策略模式定義了一系列算法，並使它們可以互相替換。這讓算法的變化獨立於使用算法的客戶：

```javascript
// 策略接口
class PaymentStrategy {
  pay(amount) {
    throw new Error('pay() method must be implemented');
  }
}

// 具體策略
class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, expiryDate, cvv) {
    super();
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
  }
  
  pay(amount) {
    console.log(`Processing credit card payment of $${amount}`);
    console.log(`Card: ****-****-****-${this.cardNumber.slice(-4)}`);
    // 模擬支付處理
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Credit card payment successful');
        resolve({ success: true, transactionId: 'CC_' + Date.now() });
      }, 1000);
    });
  }
}

class PayPalPayment extends PaymentStrategy {
  constructor(email) {
    super();
    this.email = email;
  }
  
  pay(amount) {
    console.log(`Processing PayPal payment of $${amount}`);
    console.log(`Email: ${this.email}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('PayPal payment successful');
        resolve({ success: true, transactionId: 'PP_' + Date.now() });
      }, 800);
    });
  }
}

class BankTransferPayment extends PaymentStrategy {
  constructor(accountNumber, routingNumber) {
    super();
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }
  
  pay(amount) {
    console.log(`Processing bank transfer of $${amount}`);
    console.log(`Account: ****${this.accountNumber.slice(-4)}`);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Bank transfer successful');
        resolve({ success: true, transactionId: 'BT_' + Date.now() });
      }, 2000);
    });
  }
}

// 上下文類別
class PaymentProcessor {
  constructor() {
    this.strategy = null;
  }
  
  setPaymentStrategy(strategy) {
    this.strategy = strategy;
  }
  
  async processPayment(amount) {
    if (!this.strategy) {
      throw new Error('No payment strategy set');
    }
    
    try {
      const result = await this.strategy.pay(amount);
      return result;
    } catch (error) {
      console.error('Payment failed:', error);
      throw error;
    }
  }
}

// 使用範例
const paymentProcessor = new PaymentProcessor();

// 使用信用卡支付
const creditCard = new CreditCardPayment('1234567890123456', '12/25', '123');
paymentProcessor.setPaymentStrategy(creditCard);
paymentProcessor.processPayment(100);

// 切換到 PayPal
setTimeout(() => {
  const paypal = new PayPalPayment('user@example.com');
  paymentProcessor.setPaymentStrategy(paypal);
  paymentProcessor.processPayment(50);
}, 2000);

// 切換到銀行轉帳
setTimeout(() => {
  const bankTransfer = new BankTransferPayment('1234567890', '987654321');
  paymentProcessor.setPaymentStrategy(bankTransfer);
  paymentProcessor.processPayment(200);
}, 4000);
```

## 結論

設計模式是軟體開發中的重要工具，它們提供了經過驗證的解決方案來處理常見問題。在 JavaScript 開發中：

- **單例模式**：管理全局狀態和資源
- **觀察者模式**：實現鬆耦合的事件系統
- **工廠模式**：創建對象的靈活方式
- **模組模式**：封裝和私有性
- **策略模式**：算法的靈活替換

掌握這些模式不僅能提高代碼質量，還能讓我們的應用更加健壯、可維護和可擴展。在實際開發中，要根據具體需求選擇合適的模式，避免過度設計。





