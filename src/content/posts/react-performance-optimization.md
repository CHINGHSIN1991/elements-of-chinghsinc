---
id: "react-performance-optimization"
title: "React 效能優化：從基礎到進階的實戰指南"
description: "深入探討 React 應用程式的效能優化技巧，包含實際代碼範例、最佳實踐和常見陷阱的避免方法"
date: "2024-03-15"
author: "陳雅婷"
image: 
    src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
    alt: "React 開發環境"
draft: false
category: "web"
tags: ["React", "效能優化", "前端開發", "JavaScript", "Web 效能"]
---

React 應用程式的效能優化是前端開發中的重要課題。隨著應用程式變得越來越複雜，了解如何識別和解決效能瓶頸變得至關重要。本文將從基礎到進階，提供實用的優化技巧和代碼範例。

## 1. 使用 React.memo 避免不必要的重新渲染

React.memo 是一個高階組件，它會對 props 進行淺比較，只有當 props 改變時才重新渲染組件：

```jsx
import React, { memo, useState, useCallback } from 'react';

// 未優化的組件
const ExpensiveComponent = ({ data, onUpdate }) => {
  console.log('ExpensiveComponent rendered');
  
  // 模擬昂貴的計算
  const expensiveValue = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div>
      <h3>Expensive Component</h3>
      <p>Total Value: {expensiveValue}</p>
      <button onClick={() => onUpdate(Math.random())}>
        Update Parent
      </button>
    </div>
  );
};

// 使用 React.memo 優化
const OptimizedExpensiveComponent = memo(({ data, onUpdate }) => {
  console.log('OptimizedExpensiveComponent rendered');
  
  const expensiveValue = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div>
      <h3>Optimized Expensive Component</h3>
      <p>Total Value: {expensiveValue}</p>
      <button onClick={() => onUpdate(Math.random())}>
        Update Parent
      </button>
    </div>
  );
});

// 父組件
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [data] = useState([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 }
  ]);
  
  // 使用 useCallback 避免函數重新創建
  const handleUpdate = useCallback((newValue) => {
    console.log('Parent updated with:', newValue);
  }, []);
  
  return (
    <div>
      <h2>Parent Component</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>
      
      {/* 未優化的組件會在每次父組件重新渲染時也重新渲染 */}
      <ExpensiveComponent data={data} onUpdate={handleUpdate} />
      
      {/* 優化的組件只有在 props 改變時才重新渲染 */}
      <OptimizedExpensiveComponent data={data} onUpdate={handleUpdate} />
    </div>
  );
};

export default ParentComponent;
```

## 2. 使用 useMemo 和 useCallback 優化計算和函數

```jsx
import React, { useState, useMemo, useCallback, memo } from 'react';

// 複雜的計算函數
const expensiveCalculation = (items) => {
  console.log('Performing expensive calculation...');
  return items.reduce((total, item) => {
    // 模擬複雜計算
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += item.value * Math.random();
    }
    return total + result;
  }, 0);
};

// 優化的列表組件
const OptimizedList = memo(({ items, onItemClick }) => {
  // 使用 useMemo 緩存昂貴的計算
  const totalValue = useMemo(() => {
    return expensiveCalculation(items);
  }, [items]);
  
  // 使用 useMemo 緩存過濾後的項目
  const filteredItems = useMemo(() => {
    return items.filter(item => item.value > 50);
  }, [items]);
  
  return (
    <div>
      <h3>Optimized List</h3>
      <p>Total Calculated Value: {totalValue.toFixed(2)}</p>
      <p>Filtered Items Count: {filteredItems.length}</p>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id} onClick={() => onItemClick(item.id)}>
            Item {item.id}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
});

// 主組件
const PerformanceDemo = () => {
  const [items, setItems] = useState([
    { id: 1, value: 30 },
    { id: 2, value: 60 },
    { id: 3, value: 90 },
    { id: 4, value: 25 },
    { id: 5, value: 75 }
  ]);
  
  const [filter, setFilter] = useState('');
  
  // 使用 useCallback 避免函數重新創建
  const handleItemClick = useCallback((itemId) => {
    console.log('Item clicked:', itemId);
  }, []);
  
  // 使用 useMemo 緩存過濾邏輯
  const filteredItems = useMemo(() => {
    if (!filter) return items;
    return items.filter(item => 
      item.id.toString().includes(filter)
    );
  }, [items, filter]);
  
  const addRandomItem = useCallback(() => {
    const newItem = {
      id: Date.now(),
      value: Math.floor(Math.random() * 100)
    };
    setItems(prev => [...prev, newItem]);
  }, []);
  
  return (
    <div>
      <h2>Performance Optimization Demo</h2>
      
      <div>
        <input
          type="text"
          placeholder="Filter by ID"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button onClick={addRandomItem}>Add Random Item</button>
      </div>
      
      <OptimizedList 
        items={filteredItems} 
        onItemClick={handleItemClick} 
      />
    </div>
  );
};

export default PerformanceDemo;
```

## 3. 虛擬化長列表（React Window）

對於大量數據的列表，使用虛擬化可以大幅提升效能：

```jsx
import React, { useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

// 生成大量數據
const generateData = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Item ${index}`,
    value: Math.floor(Math.random() * 1000),
    description: `This is item number ${index} with some description text`
  }));
};

// 列表項組件
const ListItem = ({ index, style, data }) => {
  const item = data[index];
  
  return (
    <div style={style} className="list-item">
      <div className="item-content">
        <h4>{item.name}</h4>
        <p>Value: {item.value}</p>
        <p className="description">{item.description}</p>
      </div>
    </div>
  );
};

// 虛擬化列表組件
const VirtualizedList = ({ items }) => {
  return (
    <div className="virtualized-container">
      <h3>Virtualized List ({items.length} items)</h3>
      <List
        height={400}
        itemCount={items.length}
        itemSize={80}
        itemData={items}
        className="virtual-list"
      >
        {ListItem}
      </List>
    </div>
  );
};

// 普通列表組件（對比用）
const RegularList = ({ items }) => {
  return (
    <div className="regular-container">
      <h3>Regular List ({items.length} items)</h3>
      <div className="regular-list" style={{ height: '400px', overflow: 'auto' }}>
        {items.map(item => (
          <div key={item.id} className="list-item">
            <div className="item-content">
              <h4>{item.name}</h4>
              <p>Value: {item.value}</p>
              <p className="description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 主組件
const ListPerformanceDemo = () => {
  const [itemCount, setItemCount] = useState(1000);
  
  const items = useMemo(() => generateData(itemCount), [itemCount]);
  
  return (
    <div>
      <h2>List Performance Comparison</h2>
      
      <div className="controls">
        <label>
          Number of items:
          <input
            type="number"
            value={itemCount}
            onChange={(e) => setItemCount(parseInt(e.target.value) || 1000)}
            min="100"
            max="10000"
            step="100"
          />
        </label>
      </div>
      
      <div className="comparison">
        <VirtualizedList items={items} />
        <RegularList items={items} />
      </div>
      
      <style jsx>{`
        .comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }
        
        .virtualized-container,
        .regular-container {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 8px;
        }
        
        .list-item {
          padding: 10px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
        }
        
        .item-content h4 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        .item-content p {
          margin: 2px 0;
          color: #666;
          font-size: 14px;
        }
        
        .description {
          font-style: italic;
        }
        
        .controls {
          margin: 20px 0;
        }
        
        .controls label {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .controls input {
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ListPerformanceDemo;
```

## 4. 代碼分割和懶加載

```jsx
import React, { Suspense, lazy, useState } from 'react';

// 懶加載組件
const LazyHeavyComponent = lazy(() => import('./HeavyComponent'));
const LazyChartComponent = lazy(() => import('./ChartComponent'));
const LazyDataTable = lazy(() => import('./DataTable'));

// 加載中組件
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading component...</p>
  </div>
);

// 錯誤邊界組件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// 主組件
const CodeSplittingDemo = () => {
  const [activeTab, setActiveTab] = useState('heavy');
  
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'heavy':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyHeavyComponent />
            </Suspense>
          </ErrorBoundary>
        );
      case 'chart':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyChartComponent />
            </Suspense>
          </ErrorBoundary>
        );
      case 'table':
        return (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <LazyDataTable />
            </Suspense>
          </ErrorBoundary>
        );
      default:
        return <div>Select a tab to load component</div>;
    }
  };
  
  return (
    <div className="code-splitting-demo">
      <h2>Code Splitting Demo</h2>
      
      <div className="tab-navigation">
        <button 
          className={activeTab === 'heavy' ? 'active' : ''}
          onClick={() => setActiveTab('heavy')}
        >
          Heavy Component
        </button>
        <button 
          className={activeTab === 'chart' ? 'active' : ''}
          onClick={() => setActiveTab('chart')}
        >
          Chart Component
        </button>
        <button 
          className={activeTab === 'table' ? 'active' : ''}
          onClick={() => setActiveTab('table')}
        >
          Data Table
        </button>
      </div>
      
      <div className="tab-content">
        {renderActiveComponent()}
      </div>
      
      <style jsx>{`
        .code-splitting-demo {
          padding: 20px;
        }
        
        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .tab-navigation button {
          padding: 10px 20px;
          border: 1px solid #ccc;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .tab-navigation button:hover {
          background: #f0f0f0;
        }
        
        .tab-navigation button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
        
        .tab-content {
          min-height: 300px;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-boundary {
          text-align: center;
          padding: 20px;
          color: #dc3545;
        }
        
        .error-boundary button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CodeSplittingDemo;
```

## 5. 使用 React DevTools Profiler 分析效能

```jsx
import React, { useState, useMemo, useCallback } from 'react';

// 效能分析組件
const ProfilerDemo = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  
  // 生成測試數據
  const generateItems = useCallback((count) => {
    const newItems = Array.from({ length: count }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
      value: Math.floor(Math.random() * 1000),
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      timestamp: Date.now() + index
    }));
    setItems(newItems);
  }, []);
  
  // 過濾和排序邏輯
  const processedItems = useMemo(() => {
    console.log('Processing items...');
    
    let filtered = items;
    if (filter) {
      filtered = items.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'value':
          return b.value - a.value;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [items, filter, sortBy]);
  
  return (
    <div className="profiler-demo">
      <h2>React Profiler Demo</h2>
      
      <div className="controls">
        <div>
          <label>
            Generate Items:
            <button onClick={() => generateItems(1000)}>1000 Items</button>
            <button onClick={() => generateItems(5000)}>5000 Items</button>
            <button onClick={() => generateItems(10000)}>10000 Items</button>
          </label>
        </div>
        
        <div>
          <label>
            Filter:
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by name or category"
            />
          </label>
        </div>
        
        <div>
          <label>
            Sort By:
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="category">Category</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="stats">
        <p>Total Items: {items.length}</p>
        <p>Filtered Items: {processedItems.length}</p>
      </div>
      
      <div className="item-list">
        {processedItems.slice(0, 100).map(item => (
          <div key={item.id} className="item">
            <span className="name">{item.name}</span>
            <span className="value">{item.value}</span>
            <span className="category">{item.category}</span>
          </div>
        ))}
        {processedItems.length > 100 && (
          <p>... and {processedItems.length - 100} more items</p>
        )}
      </div>
      
      <style jsx>{`
        .profiler-demo {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .controls label {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .controls button {
          padding: 5px 10px;
          margin: 0 5px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .controls button:hover {
          background: #0056b3;
        }
        
        .controls input,
        .controls select {
          padding: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-weight: bold;
        }
        
        .item-list {
          max-height: 400px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .item {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          border-bottom: 1px solid #eee;
        }
        
        .item:last-child {
          border-bottom: none;
        }
        
        .name {
          flex: 1;
          font-weight: bold;
        }
        
        .value {
          flex: 0 0 80px;
          text-align: right;
          color: #666;
        }
        
        .category {
          flex: 0 0 60px;
          text-align: center;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

export default ProfilerDemo;
```

## 結論

React 效能優化是一個持續的過程，需要結合多種技術和工具：

### 關鍵優化技巧：
1. **React.memo** - 避免不必要的重新渲染
2. **useMemo/useCallback** - 緩存計算和函數
3. **虛擬化** - 處理大量數據
4. **代碼分割** - 減少初始載入時間
5. **Profiler** - 識別效能瓶頸

### 最佳實踐：
- 測量後再優化，不要過早優化
- 使用 React DevTools 分析效能
- 保持組件小而專注
- 合理使用狀態管理
- 定期檢查和更新依賴

記住，效能優化應該基於實際的測量和用戶體驗需求，而不是理論上的最佳實踐。





