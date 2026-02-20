import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

/* ---------- Data Models ---------- */
interface Plant { 
  id: string; 
  name: string; 
  category: string; 
  price: string | number; 
  stockCount: number; 
  description: string; 
  image: string; 
}
interface MLReport { id: number; timestamp: string; prediction: string; confidence: string; }
interface Enquiry { id: string; name: string; phone: string; message: string; date: string; }

interface ClusterData {
  cluster: number;
  plants: Plant[];
  avgPrice: number;
  avgStock: number;
  dominantCategory: string;
  size: number;
  totalValue: number;
}

interface PriceRangeData {
  range: string;
  count: number;
  plants: Plant[];
}

interface StockHealthData {
  status: 'Critical' | 'Low' | 'Healthy' | 'Overstocked';
  count: number;
  plants: Plant[];
}

interface BrowserFingerprint {
  id: string;
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
  visitCount: number;
  avgTimeOnSite: number;
  pagesVisited: string[];
  interests: string[];
  interactionScore: number;
  cluster?: number;
}

interface UserCluster {
  id: number;
  name: string;
  users: BrowserFingerprint[];
  characteristics: string[];
  size: number;
  avgInteractionScore: number;
  topInterests: string[];
  color: string;
}

const AdminPage: React.FC = () => {
  const [step, setStep] = useState(1); 
  const [activeTab, setActiveTab] = useState("dashboard");
  const [creds, setCreds] = useState({ username: "", password: "" });
  const [stats, setStats] = useState({ plantCount: 0, plants: [] as Plant[], enquiries: [] as Enquiry[] });
  const [mlData, setMlData] = useState<MLReport[]>([]);
  const [plant, setPlant] = useState({ name: "", category: "Fruit", price: "", stockCount: 0, description: "", image: "" });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [priceRanges, setPriceRanges] = useState<PriceRangeData[]>([]);
  const [stockHealth, setStockHealth] = useState<StockHealthData[]>([]);
  const [showClusterDetails, setShowClusterDetails] = useState(false);
  
  /* User Clustering States */
  const [userFingerprints, setUserFingerprints] = useState<BrowserFingerprint[]>([]);
  const [userClusters, setUserClusters] = useState<UserCluster[]>([]);
  const [selectedUserCluster, setSelectedUserCluster] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; user: BrowserFingerprint } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  const loadAllData = async () => {
    try {
      const statsRes = await axios.get("http://localhost:3002/admin/stats");
      setStats(statsRes.data);
      const mlRes = await axios.get("http://localhost:3003/feedback");
      const data = Array.isArray(mlRes.data) ? mlRes.data.reverse() : [];
      setMlData(data); 
    } catch (e) {
      console.error("CRITICAL: DATA SYNC FAILURE");
    }
  };

  useEffect(() => { if (step === 3) loadAllData(); }, [step]);

  /* ---------- Browser Fingerprint Simulation ---------- */
  const generateSimulatedFingerprints = (count: number = 50): BrowserFingerprint[] => {
    const fingerprints: BrowserFingerprint[] = [];
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
      'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    ];
    
    const languages = ['en-US', 'en-GB', 'hi-IN', 'es-ES', 'fr-FR', 'de-DE', 'zh-CN', 'ja-JP'];
    const platforms = ['Win32', 'MacIntel', 'iPhone', 'Linux armv8l', 'iPad'];
    const resolutions = ['1920x1080', '1366x768', '1536x864', '1440x900', '2560x1440', '375x812', '414x896'];
    const timezones = ['America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Paris'];
    const interests = ['Fruit Plants', 'Vegetable Seeds', 'Gardening Tools', 'Fertilizers', 'Indoor Plants', 'Medicinal Plants', 'Flower Seeds', 'Organic Gardening'];
    
    // Generate clusters of users with similar behaviors
    const clusterCenters = [
      { interaction: 85, visitCount: 45, interestBase: 0 }, // Power users
      { interaction: 65, visitCount: 25, interestBase: 2 }, // Regular gardeners
      { interaction: 35, visitCount: 12, interestBase: 4 }, // Casual browsers
      { interaction: 15, visitCount: 5, interestBase: 6 }   // New visitors
    ];

    for (let i = 0; i < count; i++) {
      // Assign to a cluster with some variation
      const clusterIdx = Math.floor(Math.random() * clusterCenters.length);
      const center = clusterCenters[clusterIdx];
      
      // Add random variation
      const interactionVariation = (Math.random() - 0.5) * 20;
      const visitVariation = (Math.random() - 0.5) * 15;
      
      const interactionScore = Math.max(0, Math.min(100, center.interaction + interactionVariation));
      const visitCount = Math.max(1, Math.floor(center.visitCount + visitVariation));
      
      // Generate user-specific interests
      const userInterests: string[] = [];
      const numInterests = Math.floor(Math.random() * 4) + 2; // 2-5 interests
      for (let j = 0; j < numInterests; j++) {
        const interestIndex = (center.interestBase + j + Math.floor(Math.random() * 2)) % interests.length;
        userInterests.push(interests[interestIndex]);
      }

      fingerprints.push({
        id: `fp_${i + 1}_${Math.random().toString(36).substr(2, 9)}`,
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        language: languages[Math.floor(Math.random() * languages.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        screenResolution: resolutions[Math.floor(Math.random() * resolutions.length)],
        timezone: timezones[Math.floor(Math.random() * timezones.length)],
        cookiesEnabled: Math.random() > 0.1,
        visitCount: visitCount,
        avgTimeOnSite: Math.floor(Math.random() * 600) + 30, // 30-630 seconds
        pagesVisited: ['/home', '/products', '/about', '/contact'].slice(0, Math.floor(Math.random() * 4) + 1),
        interests: userInterests,
        interactionScore: Math.floor(interactionScore),
        cluster: clusterIdx
      });
    }
    
    return fingerprints;
  };

  /* ---------- User Clustering Algorithm ---------- */
  const performUserClustering = (fingerprints: BrowserFingerprint[], k: number = 4): UserCluster[] => {
    if (!fingerprints.length) return [];

    // Extract features for clustering
    const features = fingerprints.map(fp => [
      fp.interactionScore / 100, // Normalize interaction score
      fp.visitCount / 50, // Normalize visit count (assuming max 50)
      fp.avgTimeOnSite / 600, // Normalize time on site
      fp.pagesVisited.length / 4 // Normalize pages visited
    ]);

    // Initialize centroids randomly
    let centroids = features.slice(0, k).map((_, i) => [...features[i]]);
    let oldCentroids: number[][] = [];
    let iterations = 0;
    const maxIterations = 100;

    // K-means clustering
    while (iterations < maxIterations && !arraysEqual(centroids, oldCentroids)) {
      oldCentroids = centroids.map(c => [...c]);
      
      // Assign points to nearest centroid
      const assignments: number[] = features.map(f => {
        let minDist = Infinity;
        let bestCluster = 0;
        centroids.forEach((centroid, idx) => {
          const dist = Math.sqrt(
            f.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
          );
          if (dist < minDist) {
            minDist = dist;
            bestCluster = idx;
          }
        });
        return bestCluster;
      });

      // Update centroids
      centroids = centroids.map((_, clusterIdx) => {
        const clusterPoints = features.filter((_, i) => assignments[i] === clusterIdx);
        if (clusterPoints.length === 0) return [...centroids[clusterIdx]];
        
        const newCentroid = clusterPoints[0].map((_, dimIdx) => 
          clusterPoints.reduce((sum, p) => sum + p[dimIdx], 0) / clusterPoints.length
        );
        return newCentroid;
      });

      iterations++;
    }

    // Final assignments
    const finalAssignments = features.map(f => {
      let minDist = Infinity;
      let bestCluster = 0;
      centroids.forEach((centroid, idx) => {
        const dist = Math.sqrt(
          f.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
        );
        if (dist < minDist) {
          minDist = dist;
          bestCluster = idx;
        }
      });
      return bestCluster;
    });

    // Assign clusters to fingerprints
    fingerprints.forEach((fp, idx) => {
      fp.cluster = finalAssignments[idx];
    });

    // Build cluster objects
    const clusterNames = ['Power Users', 'Regular Gardeners', 'Casual Browsers', 'New Visitors'];
    const clusterColors = ['#4ade80', '#38bdf8', '#fbbf24', '#f472b6'];
    
    const clusterMap = new Map<number, BrowserFingerprint[]>();
    fingerprints.forEach((fp, idx) => {
      const clusterIdx = finalAssignments[idx];
      if (!clusterMap.has(clusterIdx)) {
        clusterMap.set(clusterIdx, []);
      }
      clusterMap.get(clusterIdx)!.push(fp);
    });

    const userClusters: UserCluster[] = [];
    clusterMap.forEach((clusterUsers, clusterIdx) => {
      // Calculate average interaction score
      const avgInteraction = clusterUsers.reduce((sum, u) => sum + u.interactionScore, 0) / clusterUsers.length;
      
      // Get top interests
      const interestCount: Record<string, number> = {};
      clusterUsers.forEach(u => {
        u.interests.forEach(interest => {
          interestCount[interest] = (interestCount[interest] || 0) + 1;
        });
      });
      
      const topInterests = Object.entries(interestCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([interest]) => interest);

      // Determine cluster characteristics
      let characteristics: string[] = [];
      if (avgInteraction > 70) {
        characteristics = ['High engagement', 'Frequent visits', 'Multiple purchases', 'Product experts'];
      } else if (avgInteraction > 50) {
        characteristics = ['Regular engagement', 'Weekly visits', 'Occasional purchases', 'Knowledge seekers'];
      } else if (avgInteraction > 30) {
        characteristics = ['Moderate engagement', 'Bi-weekly visits', 'Price sensitive', 'Information gathering'];
      } else {
        characteristics = ['Low engagement', 'Rare visits', 'New to gardening', 'Exploring options'];
      }

      userClusters.push({
        id: clusterIdx + 1,
        name: clusterNames[clusterIdx % clusterNames.length],
        users: clusterUsers,
        characteristics,
        size: clusterUsers.length,
        avgInteractionScore: avgInteraction,
        topInterests,
        color: clusterColors[clusterIdx % clusterColors.length]
      });
    });

    return userClusters.sort((a, b) => a.id - b.id);
  };

  const arraysEqual = (a: number[][], b: number[][]) => {
    if (a.length !== b.length) return false;
    return a.every((arr, i) => 
      arr.length === b[i].length && 
      arr.every((val, j) => Math.abs(val - b[i][j]) < 0.0001)
    );
  };

  /* ---------- Draw Scatter Plot ---------- */
  const drawScatterPlot = () => {
    if (!canvasRef.current || !userFingerprints.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 20);
    ctx.lineTo(50, height - 50);
    ctx.lineTo(width - 30, height - 50);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('Interaction Score →', width - 150, height - 20);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Visit Frequency →', 0, 0);
    ctx.restore();

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = 50 + (i * (width - 100) / 10);
      const y = height - 50 - (i * (height - 100) / 10);
      
      ctx.beginPath();
      ctx.moveTo(x, height - 50);
      ctx.lineTo(x, 20);
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(width - 30, y);
      ctx.stroke();
    }

    // Plot points
    userFingerprints.forEach(fp => {
      const x = 50 + (fp.interactionScore / 100) * (width - 100);
      const y = height - 50 - (fp.visitCount / 50) * (height - 100);
      
      const cluster = userClusters.find(c => c.id === (fp.cluster || 0) + 1);
      const color = cluster?.color || '#94a3b8';

      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw border
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Highlight hovered point
      if (hoveredPoint && 
          Math.abs(hoveredPoint.x - x) < 10 && 
          Math.abs(hoveredPoint.y - y) < 10) {
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    });

    // Draw cluster centers
    userClusters.forEach(cluster => {
      const centerX = 50 + (cluster.avgInteractionScore / 100) * (width - 100);
      const centerY = height - 50 - (cluster.users.reduce((sum, u) => sum + u.visitCount, 0) / cluster.size / 50) * (height - 100);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
      ctx.fillStyle = cluster.color;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = cluster.color;
      ctx.fill();
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText(`C${cluster.id}`, centerX - 8, centerY - 15);
    });
  };

  // Initialize user fingerprints
  useEffect(() => {
    const fingerprints = generateSimulatedFingerprints(50);
    setUserFingerprints(fingerprints);
    const userClusters = performUserClustering(fingerprints, 4);
    setUserClusters(userClusters);
  }, []);

  // Redraw scatter plot when data changes
  useEffect(() => {
    drawScatterPlot();
  }, [userFingerprints, userClusters, hoveredPoint]);

  // Update plant clusters when plants change
  useEffect(() => {
    if (stats.plants.length > 0) {
      const clusterResults = performClustering(stats.plants, 4);
      setClusters(clusterResults);
      setPriceRanges(analyzePriceRanges(stats.plants));
      setStockHealth(analyzeStockHealth(stats.plants));
    }
  }, [stats.plants]);

  /* ---------- Plant Clustering Algorithm ---------- */
  const performClustering = (plants: Plant[], k: number = 4): ClusterData[] => {
    if (!plants.length) return [];

    // Normalize data for clustering
    const prices = plants.map(p => Number(p.price) || 0);
    const stocks = plants.map(p => p.stockCount || 0);
    
    const maxPrice = Math.max(...prices);
    const maxStock = Math.max(...stocks);
    
    // Prepare normalized feature vectors
    const features = plants.map(p => [
      (Number(p.price) || 0) / (maxPrice || 1),
      (p.stockCount || 0) / (maxStock || 1),
      // Encode category as simple numeric (0-4)
      p.category === 'Fruit' ? 0.2 :
      p.category === 'Flower' ? 0.4 :
      p.category === 'Vegetable' ? 0.6 :
      p.category === 'Medicinal' ? 0.8 : 1.0
    ]);

    // Initialize centroids randomly
    let centroids = features.slice(0, k).map((_, i) => [...features[i]]);
    let oldCentroids: number[][] = [];
    let iterations = 0;
    const maxIterations = 100;

    // K-means clustering
    while (iterations < maxIterations && !arraysEqual(centroids, oldCentroids)) {
      oldCentroids = centroids.map(c => [...c]);
      
      // Assign points to nearest centroid
      const assignments: number[] = features.map(f => {
        let minDist = Infinity;
        let bestCluster = 0;
        centroids.forEach((centroid, idx) => {
          const dist = Math.sqrt(
            f.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
          );
          if (dist < minDist) {
            minDist = dist;
            bestCluster = idx;
          }
        });
        return bestCluster;
      });

      // Update centroids
      centroids = centroids.map((_, clusterIdx) => {
        const clusterPoints = features.filter((_, i) => assignments[i] === clusterIdx);
        if (clusterPoints.length === 0) return [...centroids[clusterIdx]];
        
        const newCentroid = clusterPoints[0].map((_, dimIdx) => 
          clusterPoints.reduce((sum, p) => sum + p[dimIdx], 0) / clusterPoints.length
        );
        return newCentroid;
      });

      iterations++;
    }

    // Organize plants into clusters
    const finalAssignments = features.map(f => {
      let minDist = Infinity;
      let bestCluster = 0;
      centroids.forEach((centroid, idx) => {
        const dist = Math.sqrt(
          f.reduce((sum, val, i) => sum + Math.pow(val - centroid[i], 2), 0)
        );
        if (dist < minDist) {
          minDist = dist;
          bestCluster = idx;
        }
      });
      return bestCluster;
    });

    // Build cluster objects
    const clusterMap = new Map<number, Plant[]>();
    plants.forEach((plant, idx) => {
      const clusterIdx = finalAssignments[idx];
      if (!clusterMap.has(clusterIdx)) {
        clusterMap.set(clusterIdx, []);
      }
      clusterMap.get(clusterIdx)!.push(plant);
    });

    // Calculate cluster statistics
    const clusterData: ClusterData[] = [];
    clusterMap.forEach((clusterPlants, clusterIdx) => {
      const prices = clusterPlants.map(p => Number(p.price) || 0);
      const stocks = clusterPlants.map(p => p.stockCount || 0);
      const categories = clusterPlants.map(p => p.category);
      
      // Find dominant category
      const categoryCount = categories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const dominantCategory = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])[0][0];

      // Calculate total inventory value
      const totalValue = clusterPlants.reduce((sum, plant) => 
        sum + (Number(plant.price) || 0) * (plant.stockCount || 0), 0);

      clusterData.push({
        cluster: clusterIdx + 1,
        plants: clusterPlants,
        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
        avgStock: stocks.reduce((a, b) => a + b, 0) / stocks.length,
        dominantCategory,
        size: clusterPlants.length,
        totalValue
      });
    });

    return clusterData.sort((a, b) => a.cluster - b.cluster);
  };

  /* ---------- Price Range Analysis ---------- */
  const analyzePriceRanges = (plants: Plant[]): PriceRangeData[] => {
    const ranges = [
      { min: 0, max: 100, label: '₹0-100' },
      { min: 101, max: 500, label: '₹101-500' },
      { min: 501, max: 1000, label: '₹501-1000' },
      { min: 1001, max: 5000, label: '₹1001-5000' },
      { min: 5001, max: Infinity, label: '₹5000+' }
    ];

    return ranges.map(range => {
      const plantsInRange = plants.filter(p => {
        const price = Number(p.price) || 0;
        return price >= range.min && price <= range.max;
      });
      return {
        range: range.label,
        count: plantsInRange.length,
        plants: plantsInRange
      };
    });
  };

  /* ---------- Stock Health Analysis ---------- */
  const analyzeStockHealth = (plants: Plant[]): StockHealthData[] => {
    const healthLevels = [
      { status: 'Critical' as const, threshold: 5 },
      { status: 'Low' as const, threshold: 20 },
      { status: 'Healthy' as const, threshold: 50 },
      { status: 'Overstocked' as const, threshold: Infinity }
    ];

    return healthLevels.map((level, index) => {
      const plantsInLevel = plants.filter(p => {
        const stock = p.stockCount || 0;
        if (index === 0) return stock <= level.threshold;
        if (index === healthLevels.length - 1) return stock > healthLevels[index - 1].threshold;
        return stock > healthLevels[index - 1].threshold && stock <= level.threshold;
      });
      return {
        status: level.status,
        count: plantsInLevel.length,
        plants: plantsInLevel
      };
    });
  };

  /* ---------- Advanced Inventory Logic ---------- */
  const getInventoryOverview = () => {
    const categories = ["Fruit", "Flower", "Vegetable", "Medicinal", "Indoor"];
    
    // Calculate global unit sum
    const globalUnitTotal = stats.plants?.reduce((sum, p) => sum + (Number(p.stockCount) || 0), 0) || 0;
    const globalValueTotal = stats.plants?.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stockCount) || 0), 0) || 0;

    const breakdown = categories.map(cat => {
      const categoryPlants = stats.plants?.filter(p => p.category === cat) || [];
      const speciesCount = categoryPlants.length;
      const categoryUnits = categoryPlants.reduce((sum, p) => sum + (Number(p.stockCount) || 0), 0);
      const categoryValue = categoryPlants.reduce((sum, p) => sum + (Number(p.price) || 0) * (Number(p.stockCount) || 0), 0);
      
      return {
        name: cat,
        species: speciesCount,
        units: categoryUnits,
        value: categoryValue,
        ratio: globalUnitTotal > 0 ? (categoryUnits / globalUnitTotal) * 100 : 0,
        valueRatio: globalValueTotal > 0 ? (categoryValue / globalValueTotal) * 100 : 0
      };
    });

    return { breakdown, globalUnitTotal, globalValueTotal };
  };

  const { breakdown, globalUnitTotal, globalValueTotal } = getInventoryOverview();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (creds.username === "admin" && creds.password === "admin123") {
      try { await axios.post("http://localhost:3002/send-otp"); setStep(2); } 
      catch { alert("OTP SYSTEM OFFLINE"); }
    } else alert("ACCESS DENIED: INVALID CREDENTIALS");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = (document.getElementById("otp-input") as HTMLInputElement)?.value;
    try {
      const res = await axios.post("http://localhost:3002/verify-otp", { otp });
      if (res.data.success) setStep(3);
    } catch { alert("VERIFICATION FAILED"); }
  };

  const handleAddPlant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/plants", plant);
      setPlant({ name: "", category: "Fruit", price: "", stockCount: 0, description: "", image: "" });
      setActiveTab("inventory");
      loadAllData();
    } catch { alert("UPLOAD FAILED"); }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !userFingerprints.length) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Find closest point
    let minDist = Infinity;
    let closestPoint: { x: number; y: number; user: BrowserFingerprint } | null = null;
    
    userFingerprints.forEach(fp => {
      const pointX = 50 + (fp.interactionScore / 100) * (width - 100);
      const pointY = height - 50 - (fp.visitCount / 50) * (height - 100);
      
      const dist = Math.sqrt(Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2));
      if (dist < minDist && dist < 30) {
        minDist = dist;
        closestPoint = { x: pointX, y: pointY, user: fp };
      }
    });
    
    setHoveredPoint(closestPoint);
  };

  if (step < 3) return (
    <div style={authWrapper}>
      <div style={glassCard}>
        <div style={{textAlign: 'center', marginBottom: '30px'}}>
           <div style={{fontSize: '0.8rem', color: '#4ade80', letterSpacing: '3px', fontWeight: '900'}}>🛡️ SYSTEM GATEWAY</div>
           <h2 style={{ color: "#FFFFFF", margin: '10px 0', fontSize: '1.8rem' }}><b>ADMINISTRATOR LOGIN</b></h2>
        </div>
        <form onSubmit={step === 1 ? handleLogin : handleVerify} style={formGroup}>
          {step === 1 ? (
            <>
              <label style={labelStyle}><b>👤 ADMIN USERNAME</b></label>
              <input style={inputStyle} placeholder="ENTER ID" onChange={e => setCreds({...creds, username: e.target.value})} />
              <label style={labelStyle}><b>🔑 SECURITY PASSKEY</b></label>
              <input style={inputStyle} type="password" placeholder="••••••••" onChange={e => setCreds({...creds, password: e.target.value})} />
            </>
          ) : (
            <>
              <label style={labelStyle}><b>📱 MOBILE OTP VERIFICATION</b></label>
              <input id="otp-input" style={otpInput} placeholder="000000" maxLength={6} />
            </>
          )}
          <button style={primaryBtn} type="submit"><b>{step === 1 ? "🔓 INITIALIZE ACCESS" : "✔️ VERIFY IDENTITY"}</b></button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={dashboardLayout}>
        <aside style={sidebar}>
          <div style={sidebarBrand}>
            <b style={{color: '#4ade80'}}>🌿 KRUSHIMITRA</b> 
            <span style={{fontSize: '0.7rem', color: '#FFFFFF', marginLeft: '5px', background: '#1e293b', padding: '2px 6px', borderRadius: '4px'}}><b>SYSTEM v2.6</b></span>
          </div>
          
          <div style={{padding: '10px'}}>
            <button onClick={() => setActiveTab("dashboard")} style={activeTab === 'dashboard' ? activeNav : navBtn}>
              <b style={{color: activeTab === 'dashboard' ? '#4ade80' : '#cbd5e1'}}>📊 COMMAND OVERVIEW</b>
            </button>
            <button onClick={() => setActiveTab("inventory")} style={activeTab === 'inventory' ? activeNav : navBtn}>
              <b style={{color: activeTab === 'inventory' ? '#4ade80' : '#cbd5e1'}}>📦 SHOP INVENTORY</b>
            </button>
            <button onClick={() => setActiveTab("disease")} style={activeTab === 'disease' ? activeNav : navBtn}>
              <b style={{color: activeTab === 'disease' ? '#fbbf24' : '#cbd5e1'}}>🔬 AI DIAGNOSTICS</b>
            </button>
            <button onClick={() => setActiveTab("enquiries")} style={activeTab === 'enquiries' ? activeNav : navBtn}>
              <b style={{color: activeTab === 'enquiries' ? '#38bdf8' : '#cbd5e1'}}>📧 CUSTOMER LEADS</b>
            </button>
            <button onClick={() => setActiveTab("add")} style={activeTab === 'add' ? activeNav : navBtn}>
              <b style={{color: activeTab === 'add' ? '#f472b6' : '#cbd5e1'}}>➕ PROVISION ASSET</b>
            </button>
          </div>
          <button onClick={() => setStep(1)} style={signoutBtn}><b>🚪 TERMINATE SESSION</b></button>
        </aside>

        <main style={mainContent}>
          <header style={header}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.2rem', color: '#FFFFFF' }}><b>{(activeTab || "").toUpperCase()}</b></h1>
              <div style={{color: '#4ade80', fontSize: '0.9rem', marginTop: '5px'}}><b>📡 ENCRYPTED SESSION ACTIVE</b></div>
            </div>
          </header>

          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div style={dashboardGrid}>
              {/* Stats Cards */}
              <div style={statCard}>
                <div style={cardHeader}><b>TOTAL PLANT VARIETIES</b> <span style={{fontSize: '1.2rem'}}>🌱</span></div>
                <div style={cardValue}>{stats.plantCount || 0}</div>
                <div style={cardSub}><b>UNIQUE TYPES IN DATABASE</b></div>
              </div>
              <div style={{...statCard, borderTop: '4px solid #38bdf8'}}>
                <div style={cardHeader}><b>AGGREGATE UNIT STOCK</b> <span style={{fontSize: '1.2rem'}}>📦</span></div>
                <div style={{...cardValue, color: '#38bdf8'}}>{globalUnitTotal}</div>
                <div style={cardSub}><b>TOTAL ITEMS ACROSS ALL CATEGORIES</b></div>
              </div>
              <div style={{...statCard, borderTop: '4px solid #fbbf24'}}>
                <div style={cardHeader}><b>ACTIVE ENQUIRIES</b> <span style={{fontSize: '1.2rem'}}>📧</span></div>
                <div style={{...cardValue, color: '#fbbf24'}}>{stats.enquiries?.length || 0}</div>
                <div style={cardSub}><b>PENDING CUSTOMER LEADS</b></div>
              </div>

              {/* Category Inventory Breakdown */}
              <div style={fullWidthCard}>
                <h3 style={{color: '#FFF', marginBottom: '30px'}}><b>📊 CATEGORY INVENTORY BREAKDOWN</b></h3>
                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                  {breakdown.map(cat => (
                    <div key={cat.name} style={miniCatCard}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <b style={{color: '#4ade80', fontSize: '0.7rem'}}>{cat.name.toUpperCase()}</b>
                        <b style={{color: '#94a3b8', fontSize: '0.6rem'}}>{Math.round(cat.ratio)}% VOL</b>
                      </div>
                      <div style={{marginTop: '15px'}}>
                        <div style={{color: '#FFF', fontSize: '1.5rem'}}><b>{cat.units} <span style={{fontSize: '0.8rem', color: '#64748b'}}>UNITS</span></b></div>
                        <div style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px'}}><b>{cat.species} TYPES • ₹{Math.round(cat.value).toLocaleString()}</b></div>
                      </div>
                      <div style={progressBar}>
                        <div style={{...progressFill, width: `${cat.ratio}%`}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* USER BEHAVIOR CLUSTER ANALYSIS - SCATTER PLOT */}
              <div style={fullWidthCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                  <div>
                    <h3 style={{color: '#FFF', margin: 0}}><b>👥 USER BEHAVIOR CLUSTER ANALYSIS</b></h3>
                    <p style={{color: '#94a3b8', fontSize: '0.8rem', marginTop: '5px'}}>
                      Based on browser fingerprinting • {userFingerprints.length} active users
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      const newFingerprints = generateSimulatedFingerprints(50);
                      setUserFingerprints(newFingerprints);
                      const newClusters = performUserClustering(newFingerprints, 4);
                      setUserClusters(newClusters);
                    }}
                    style={refreshBtn}
                  >
                    <b>🔄 SIMULATE NEW DATA</b>
                  </button>
                </div>

                {/* Scatter Plot Canvas */}
                <div style={scatterPlotContainer}>
                  <canvas 
                    ref={canvasRef}
                    style={scatterPlot}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {/* Hover Tooltip */}
                  {hoveredPoint && (
                    <div style={{
                      ...tooltip,
                      left: hoveredPoint.x + 20,
                      top: hoveredPoint.y - 40
                    }}>
                      <b style={{color: '#4ade80'}}>{hoveredPoint.user.id}</b>
                      <div style={{fontSize: '0.7rem', marginTop: '5px'}}>
                        <div>Interaction: {hoveredPoint.user.interactionScore}%</div>
                        <div>Visits: {hoveredPoint.user.visitCount}</div>
                        <div>Time: {Math.floor(hoveredPoint.user.avgTimeOnSite / 60)}m {hoveredPoint.user.avgTimeOnSite % 60}s</div>
                        <div>Interests: {hoveredPoint.user.interests.join(', ')}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Cluster Cards */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '30px'}}>
                  {userClusters.map(cluster => (
                    <div 
                      key={cluster.id}
                      style={{
                        ...userClusterCard,
                        borderTop: `4px solid ${cluster.color}`,
                        cursor: 'pointer',
                        transform: selectedUserCluster === cluster.id ? 'scale(1.02)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setSelectedUserCluster(cluster.id)}
                      onMouseLeave={() => setSelectedUserCluster(null)}
                      onClick={() => setSelectedUserCluster(selectedUserCluster === cluster.id ? null : cluster.id)}
                    >
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <b style={{color: cluster.color}}>{cluster.name}</b>
                        <span style={{fontSize: '0.7rem', color: '#64748b'}}>{cluster.size} users</span>
                      </div>
                      <div style={{fontSize: '1.2rem', color: '#FFF', margin: '10px 0'}}>
                        <b>{Math.round(cluster.avgInteractionScore)}%</b> <span style={{fontSize: '0.7rem', color: '#94a3b8'}}>avg engagement</span>
                      </div>
                      <div style={{fontSize: '0.7rem', color: '#94a3b8'}}>
                        <div><b>Top interests:</b> {cluster.topInterests.join(', ')}</div>
                      </div>
                      <div style={{marginTop: '10px'}}>
                        {cluster.characteristics.slice(0, 2).map((char, i) => (
                          <span key={i} style={characteristicBadge}>{char}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Detailed User View */}
                {selectedUserCluster && (
                  <div style={userDetailCard}>
                    <h4 style={{color: '#FFF', marginBottom: '20px'}}>
                      <b>{userClusters.find(c => c.id === selectedUserCluster)?.name} - DETAILED ANALYSIS</b>
                    </h4>
                    <table style={clusterTable}>
                      <thead>
                        <tr style={tableHead}>
                          <th><b>USER ID</b></th>
                          <th><b>PLATFORM</b></th>
                          <th><b>BROWSER</b></th>
                          <th><b>INTERACTION</b></th>
                          <th><b>VISITS</b></th>
                          <th><b>TIME ON SITE</b></th>
                          <th><b>INTERESTS</b></th>
                        </tr>
                      </thead>
                      <tbody>
                        {userClusters
                          .find(c => c.id === selectedUserCluster)
                          ?.users.slice(0, 5)
                          .map(user => (
                            <tr key={user.id} style={clusterTableRow}>
                              <td><b style={{color: '#4ade80'}}>{user.id}</b></td>
                              <td><span style={infoBadge}>{user.platform}</span></td>
                              <td><span style={infoBadge}>{user.userAgent.substring(0, 30)}...</span></td>
                              <td><b style={{color: getInteractionColor(user.interactionScore)}}>{user.interactionScore}%</b></td>
                              <td><b>{user.visitCount}</b></td>
                              <td><b>{Math.floor(user.avgTimeOnSite / 60)}m {user.avgTimeOnSite % 60}s</b></td>
                              <td><span style={infoBadge}>{user.interests.join(', ')}</span></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {userClusters.find(c => c.id === selectedUserCluster)?.users.length > 5 && (
                      <div style={{color: '#64748b', fontSize: '0.8rem', marginTop: '10px'}}>
                        <b>+ {userClusters.find(c => c.id === selectedUserCluster)!.users.length - 5} more users</b>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PLANT CLUSTER ANALYSIS SECTION */}
              <div style={fullWidthCard}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
                  <h3 style={{color: '#FFF'}}><b>🔬 PLANT INVENTORY CLUSTER ANALYSIS</b></h3>
                  <button 
                    onClick={() => setShowClusterDetails(!showClusterDetails)}
                    style={clusterToggleBtn}
                  >
                    <b>{showClusterDetails ? '📋 SHOW SUMMARY' : '🔍 VIEW DETAILS'}</b>
                  </button>
                </div>

                {/* Plant Cluster Summary Cards */}
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px'}}>
                  {clusters.map((cluster, index) => {
                    const colors = ['#4ade80', '#38bdf8', '#fbbf24', '#f472b6'];
                    return (
                      <div 
                        key={cluster.cluster}
                        style={{
                          ...clusterCard,
                          borderTop: `4px solid ${colors[index % colors.length]}`,
                          cursor: 'pointer',
                          transform: selectedCluster === cluster.cluster ? 'scale(1.02)' : 'scale(1)'
                        }}
                        onMouseEnter={() => setSelectedCluster(cluster.cluster)}
                        onMouseLeave={() => setSelectedCluster(null)}
                        onClick={() => setSelectedCluster(selectedCluster === cluster.cluster ? null : cluster.cluster)}
                      >
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                          <b style={{color: colors[index % colors.length]}}>CLUSTER {cluster.cluster}</b>
                          <span style={{fontSize: '0.7rem', color: '#64748b'}}>{cluster.size} plants</span>
                        </div>
                        <div style={{fontSize: '1.8rem', color: '#FFF', margin: '15px 0'}}>
                          <b>{cluster.dominantCategory}</b>
                        </div>
                        <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>
                          <div><b>Avg Price: ₹{Math.round(cluster.avgPrice)}</b></div>
                          <div><b>Avg Stock: {Math.round(cluster.avgStock)} units</b></div>
                          <div style={{color: colors[index % colors.length]}}><b>Value: ₹{Math.round(cluster.totalValue).toLocaleString()}</b></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Plant Cluster View */}
                {showClusterDetails && selectedCluster && (
                  <div style={clusterDetailCard}>
                    <h4 style={{color: '#FFF', marginBottom: '20px'}}>
                      <b>CLUSTER {selectedCluster} - DETAILED ANALYSIS</b>
                    </h4>
                    <table style={clusterTable}>
                      <thead>
                        <tr style={tableHead}>
                          <th><b>PLANT NAME</b></th>
                          <th><b>CATEGORY</b></th>
                          <th><b>PRICE (₹)</b></th>
                          <th><b>STOCK</b></th>
                          <th><b>VALUE (₹)</b></th>
                        </tr>
                      </thead>
                      <tbody>
                        {clusters
                          .find(c => c.cluster === selectedCluster)
                          ?.plants.map(plant => (
                            <tr key={plant.id} style={clusterTableRow}>
                              <td><b style={{color: '#FFF'}}>{plant.name}</b></td>
                              <td><span style={categoryBadge(plant.category)}>{plant.category}</span></td>
                              <td><b>₹{plant.price}</b></td>
                              <td><span style={plant.stockCount < 10 ? lowStockTag : stockTag}>{plant.stockCount}</span></td>
                              <td><b style={{color: '#4ade80'}}>₹{((Number(plant.price) || 0) * (plant.stockCount || 0)).toLocaleString()}</b></td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Plant Cluster Insights */}
                <div style={{marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  {clusters.map(cluster => (
                    <div key={`insight-${cluster.cluster}`} style={insightCard}>
                      <b style={{color: '#4ade80'}}>CLUSTER {cluster.cluster} INSIGHTS</b>
                      <ul style={insightList}>
                        <li>🎯 <b>Target Audience:</b> {getTargetAudience(cluster)}</li>
                        <li>📈 <b>Recommendation:</b> {getRecommendation(cluster)}</li>
                        <li>💰 <b>Inventory Value:</b> ₹{cluster.totalValue.toLocaleString()}</li>
                        <li>🔄 <b>Turnover Rate:</b> {getTurnoverRate(cluster)}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRICE RANGE ANALYSIS */}
              <div style={halfWidthCard}>
                <h3 style={{color: '#FFF', marginBottom: '20px'}}><b>💰 PRICE RANGE DISTRIBUTION</b></h3>
                {priceRanges.map(range => (
                  <div key={range.range} style={priceRangeBar}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                      <b style={{color: '#94a3b8'}}>{range.range}</b>
                      <b style={{color: '#4ade80'}}>{range.count} plants</b>
                    </div>
                    <div style={progressBar}>
                      <div style={{
                        ...progressFill,
                        width: `${(range.count / stats.plantCount) * 100}%`,
                        background: '#38bdf8'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STOCK HEALTH ANALYSIS */}
              <div style={halfWidthCard}>
                <h3 style={{color: '#FFF', marginBottom: '20px'}}><b>📊 STOCK HEALTH METRICS</b></h3>
                {stockHealth.map(health => (
                  <div key={health.status} style={healthCard}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <span style={healthBadge(health.status)}>{health.status}</span>
                        <b style={{color: '#94a3b8', marginLeft: '10px'}}>{health.count} items</b>
                      </div>
                      <b style={{color: getHealthColor(health.status)}}>
                        {((health.count / stats.plantCount) * 100).toFixed(1)}%
                      </b>
                    </div>
                    {health.count > 0 && (
                      <div style={{marginTop: '10px', fontSize: '0.7rem', color: '#64748b'}}>
                        <b>{health.plants.slice(0, 3).map(p => p.name).join(', ')}</b>
                        {health.count > 3 && ` +${health.count - 3} more`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INVENTORY / DISEASE / ENQUIRIES TABLES */}
          {(activeTab === 'inventory' || activeTab === 'disease' || activeTab === 'enquiries') && (
            <div style={card}>
              <table style={table}>
                <thead>
                  <tr style={tableHead}>
                    <th style={{padding: '18px'}}><b>🏷️ ITEM SPECIFICATIONS</b></th>
                    <th><b>📂 CATEGORY</b></th>
                    {activeTab === 'inventory' && <th><b>💰 MARKET PRICE</b></th>}
                    {activeTab === 'inventory' && <th><b>📊 STOCK LEVEL</b></th>}
                    {activeTab === 'disease' && <th><b>🤖 AI RESULT</b></th>}
                    {activeTab === 'disease' && <th><b>🎯 PRECISION</b></th>}
                    {activeTab === 'enquiries' && <th><b>💬 LEAD MESSAGE</b></th>}
                    <th style={{textAlign: 'right', paddingRight: '25px'}}><b>⚙️ ACTIONS</b></th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === 'inventory' && stats.plants?.map(p => (
                    <tr key={p.id} style={{...tableRow, borderLeft: hoveredRow === p.id ? '5px solid #4ade80' : '5px solid transparent'}} onMouseEnter={() => setHoveredRow(p.id)} onMouseLeave={() => setHoveredRow(null)}>
                      <td style={tableData}><div style={{display:'flex', alignItems:'center', paddingLeft: '15px'}}><img src={p.image} style={thumb} /><b>{(p.name || "UNNAMED").toUpperCase()}</b></div></td>
                      <td><b style={{color: '#94a3b8'}}>{(p.category || "GENERAL").toUpperCase()}</b></td>
                      <td><b style={{color: '#FFFFFF'}}>₹{p.price || 0}</b></td>
                      <td><span style={(p.stockCount || 0) < 10 ? lowStockTag : stockTag}><b>{p.stockCount || 0} UNITS</b></span></td>
                      <td style={{textAlign: 'right', paddingRight: '25px'}}><button style={delBtn}><b>REMOVE</b></button></td>
                    </tr>
                  ))}
                  {activeTab === 'enquiries' && stats.enquiries?.map(enq => (
                    <tr key={enq.id} style={tableRow}>
                      <td style={{...tableData, paddingLeft: '15px'}}><b style={{color: '#FFFFFF'}}>👤 {(enq.name || "GUEST").toUpperCase()}</b><br/><small style={{color: '#38bdf8'}}><b>📞 {enq.phone || "N/A"}</b></small></td>
                      <td><b style={{color: '#94a3b8'}}>LEAD</b></td>
                      <td style={{color: '#cbd5e1', fontSize: '0.9rem'}}><b>"{enq.message || "No message provided"}"</b></td>
                      <td style={{color: '#64748b'}}><b>{enq.date || "Unknown"}</b></td>
                      <td style={{textAlign: 'right', paddingRight: '25px'}}><button style={{...delBtn, borderColor: '#38bdf8', color: '#38bdf8'}}><b>RESOLVE</b></button></td>
                    </tr>
                  ))}
                  {activeTab === 'disease' && mlData?.map(log => (
                    <tr key={log.id} style={tableRow}>
                      <td style={{...tableData, paddingLeft: '15px'}}><b style={{color: '#64748b'}}>🕒 {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "00:00"}</b></td>
                      <td><b style={{color: '#FFFFFF'}}>SCAN_NODE_{log.id}</b></td>
                      <td><span style={reportBadge(log.prediction || "Unknown")}><b>{(log.prediction || "UNKNOWN").toUpperCase()}</b></span></td>
                      <td><b style={{color: '#4ade80'}}>{(log.confidence || "0%").toUpperCase()}</b></td>
                      <td style={{textAlign: 'right', paddingRight: '25px'}}><button style={delBtn}><b>ARCHIVE</b></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'add' && (
            <div style={{...card, maxWidth: '600px', margin: '0 auto', padding: '40px'}}>
               <form onSubmit={handleAddPlant} style={formGroup}>
                <h3 style={{color: '#f472b6', marginBottom: '20px'}}><b>➕ REGISTER NEW ASSET</b></h3>
                <label style={labelStyle}><b>🌱 PLANT SPECIES NAME</b></label>
                <input style={inputStyle} onChange={e => setPlant({...plant, name: e.target.value})} required />
                <div style={{display: 'flex', gap: '20px'}}>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}><b>📂 CATEGORY</b></label>
                    <select style={inputStyle} onChange={e => setPlant({...plant, category: e.target.value})}>
                      <option>Fruit</option><option>Flower</option><option>Vegetable</option><option>Medicinal</option><option>Indoor</option>
                    </select>
                  </div>
                  <div style={{flex: 1}}>
                    <label style={labelStyle}><b>💰 UNIT PRICE (INR)</b></label>
                    <input style={inputStyle} type="number" onChange={e => setPlant({...plant, price: e.target.value})} required />
                  </div>
                </div>
                <label style={labelStyle}><b>📊 INITIAL STOCK QUANTITY</b></label>
                <input style={inputStyle} type="number" onChange={e => setPlant({...plant, stockCount: parseInt(e.target.value)})} required />
                <label style={labelStyle}><b>🖼️ IMAGE UPLOAD</b></label>
                <input style={inputStyle} type="file" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { const r = new FileReader(); r.onloadend = () => setPlant({...plant, image: r.result as string}); r.readAsDataURL(f); }
                }} required />
                <button style={{...primaryBtn, background: '#f472b6'}} type="submit"><b>🚀 DEPLOY TO INVENTORY</b></button>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

/* Helper Functions */
const getTargetAudience = (cluster: ClusterData): string => {
  if (cluster.avgPrice > 1000) return 'Premium/Luxury Buyers';
  if (cluster.avgPrice > 500) return 'Mid-Range Consumers';
  if (cluster.avgStock > 30) return 'Bulk Purchasers';
  return 'Casual Gardeners';
};

const getRecommendation = (cluster: ClusterData): string => {
  if (cluster.avgStock < 10) return 'URGENT: Restock immediately';
  if (cluster.avgStock < 20) return 'Monitor stock levels closely';
  if (cluster.avgStock > 50) return 'Consider promotion to reduce inventory';
  return 'Maintain current levels';
};

const getTurnoverRate = (cluster: ClusterData): string => {
  const rate = cluster.totalValue / (cluster.avgStock * cluster.size || 1);
  if (rate > 1000) return 'High Velocity';
  if (rate > 500) return 'Moderate';
  return 'Slow Moving';
};

const getHealthColor = (status: string): string => {
  switch(status) {
    case 'Critical': return '#f87171';
    case 'Low': return '#fbbf24';
    case 'Healthy': return '#4ade80';
    case 'Overstocked': return '#60a5fa';
    default: return '#94a3b8';
  }
};

const getInteractionColor = (score: number): string => {
  if (score >= 70) return '#4ade80';
  if (score >= 40) return '#fbbf24';
  return '#f87171';
};

const healthBadge = (status: string) => ({
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '0.7rem',
  fontWeight: 'bold',
  background: status === 'Critical' ? 'rgba(248, 113, 113, 0.1)' :
               status === 'Low' ? 'rgba(251, 191, 36, 0.1)' :
               status === 'Healthy' ? 'rgba(74, 222, 128, 0.1)' :
               'rgba(96, 165, 250, 0.1)',
  color: status === 'Critical' ? '#f87171' :
         status === 'Low' ? '#fbbf24' :
         status === 'Healthy' ? '#4ade80' :
         '#60a5fa',
  border: '1px solid currentColor'
});

const categoryBadge = (category: string) => ({
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '0.7rem',
  background: 'rgba(74, 222, 128, 0.1)',
  color: '#4ade80',
  border: '1px solid #4ade80'
});

const infoBadge = {
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '0.6rem',
  background: '#1e293b',
  color: '#94a3b8',
  border: '1px solid #334155'
};

const characteristicBadge = {
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: '12px',
  fontSize: '0.6rem',
  background: 'rgba(74, 222, 128, 0.1)',
  color: '#4ade80',
  marginRight: '5px',
  marginBottom: '5px',
  border: '1px solid #4ade80'
};

/* ---------- STYLES ---------- */
const dashboardLayout: any = { display: "flex", backgroundColor: "#020617", minHeight: "100vh", fontFamily: "'Inter', sans-serif" };
const sidebar: any = { width: "300px", background: "#0f172a", borderRight: "2px solid #1e293b", position: "fixed", height: "100vh", display: "flex", flexDirection: "column" };
const sidebarBrand: any = { padding: "40px 25px", fontSize: "1.4rem", borderBottom: '2px solid #1e293b' };
const mainContent: any = { flex: 1, marginLeft: "300px", padding: "60px" };
const navBtn: any = { padding: "20px 25px", background: "none", border: "none", textAlign: "left", cursor: "pointer", width: '100%', transition: '0.3s' };
const activeNav: any = { ...navBtn, background: "rgba(74, 222, 128, 0.1)", borderRight: "5px solid #4ade80" };
const signoutBtn: any = { ...navBtn, color: "#f87171", marginTop: "auto", marginBottom: "40px", borderTop: '2px solid #1e293b' };
const header: any = { display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: "50px" };

/* Dashboard Grid Styles */
const dashboardGrid: any = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' };
const statCard: any = { background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b', borderTop: '4px solid #4ade80', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const cardHeader: any = { display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '1px' };
const cardValue: any = { fontSize: '3.2rem', color: '#FFF', margin: '15px 0', fontWeight: 'bold' };
const cardSub: any = { fontSize: '0.7rem', color: '#64748b', fontWeight: 'bold' };

const fullWidthCard: any = { gridColumn: 'span 3', background: '#0f172a', padding: '40px', borderRadius: '25px', border: '1px solid #1e293b' };
const halfWidthCard: any = { gridColumn: 'span 1', background: '#0f172a', padding: '30px', borderRadius: '20px', border: '1px solid #1e293b' };
const miniCatCard: any = { flex: 1, minWidth: '220px', background: '#020617', padding: '25px', borderRadius: '20px', border: '1px solid #1e293b' };
const progressBar: any = { width: '100%', height: '8px', background: '#1e293b', borderRadius: '10px', marginTop: '15px' };
const progressFill: any = { height: '100%', background: '#4ade80', borderRadius: '10px' };

/* Scatter Plot Styles */
const scatterPlotContainer: any = {
  background: '#020617',
  padding: '30px',
  borderRadius: '15px',
  border: '1px solid #1e293b',
  position: 'relative',
  height: '500px'
};

const scatterPlot: any = {
  width: '100%',
  height: '100%',
  display: 'block',
  cursor: 'crosshair'
};

const tooltip: any = {
  position: 'absolute',
  background: '#0f172a',
  border: '1px solid #4ade80',
  borderRadius: '8px',
  padding: '10px',
  color: '#FFFFFF',
  fontSize: '0.8rem',
  pointerEvents: 'none',
  zIndex: 1000,
  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
  maxWidth: '250px'
};

const refreshBtn: any = {
  background: 'rgba(56, 189, 248, 0.1)',
  border: '1px solid #38bdf8',
  color: '#38bdf8',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.8rem'
};

/* Cluster Analysis Styles */
const clusterCard: any = {
  background: '#020617',
  padding: '25px',
  borderRadius: '15px',
  border: '1px solid #1e293b',
  transition: 'all 0.3s ease'
};

const userClusterCard: any = {
  background: '#020617',
  padding: '20px',
  borderRadius: '15px',
  border: '1px solid #1e293b',
  transition: 'all 0.3s ease'
};

const clusterDetailCard: any = {
  background: '#020617',
  padding: '30px',
  borderRadius: '15px',
  border: '1px solid #4ade80',
  marginTop: '30px'
};

const userDetailCard: any = {
  background: '#020617',
  padding: '30px',
  borderRadius: '15px',
  border: '1px solid #38bdf8',
  marginTop: '30px'
};

const clusterTable: any = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem'
};

const clusterTableRow: any = {
  borderBottom: '1px solid #1e293b',
  '&:last-child': { borderBottom: 'none' }
};

const insightCard: any = {
  background: '#020617',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #1e293b'
};

const insightList: any = {
  listStyle: 'none',
  padding: 0,
  marginTop: '15px',
  color: '#94a3b8',
  fontSize: '0.85rem',
  lineHeight: '2'
};

const priceRangeBar: any = {
  marginBottom: '20px'
};

const healthCard: any = {
  background: '#020617',
  padding: '15px',
  borderRadius: '10px',
  marginBottom: '10px',
  border: '1px solid #1e293b'
};

const clusterToggleBtn: any = {
  background: 'rgba(74, 222, 128, 0.1)',
  border: '1px solid #4ade80',
  color: '#4ade80',
  padding: '10px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.8rem',
  transition: 'all 0.3s ease',
  ':hover': {
    background: 'rgba(74, 222, 128, 0.2)'
  }
};

/* General UI Styles */
const card: any = { background: "#0f172a", borderRadius: "20px", border: "2px solid #1e293b", overflow: 'hidden' };
const table: any = { width: "100%", borderCollapse: "collapse" };
const tableHead: any = { textAlign: "left", background: "#1e293b", color: "#94a3b8", fontSize: "0.8rem", padding: '15px' };
const tableRow: any = { borderBottom: "1px solid #1e293b" };
const tableData: any = { padding: "20px 0" };
const thumb: any = { width: "50px", height: "50px", borderRadius: "10px", marginRight: "15px", objectFit: 'cover' };
const delBtn: any = { background: "none", color: "#f87171", border: "1px solid #7f1d1d", padding: "8px 15px", borderRadius: "6px", cursor: "pointer" };
const stockTag: any = { padding: "5px 12px", background: "rgba(74, 222, 128, 0.1)", color: "#4ade80", borderRadius: "6px", fontSize: '0.75rem' };
const lowStockTag: any = { ...stockTag, background: "rgba(248, 113, 113, 0.1)", color: "#f87171" };

/* Auth Components */
const authWrapper: any = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#020617" };
const glassCard: any = { background: "#0f172a", padding: "60px", borderRadius: "30px", border: "2px solid #1e293b", width: "450px" };
const inputStyle: any = { padding: "18px", background: "#020617", border: "2px solid #334155", color: "#FFFFFF", borderRadius: "15px", width: "100%", marginBottom: "25px" };
const primaryBtn: any = { padding: "20px", background: "#4ade80", color: "#020617", border: "none", borderRadius: "15px", width: "100%", cursor: "pointer", fontWeight: 'bold' };
const formGroup: any = { display: "flex", flexDirection: "column" };
const labelStyle: any = { fontSize: "0.8rem", color: "#94a3b8", marginBottom: "10px" };
const otpInput: any = { ...inputStyle, textAlign: "center", fontSize: "2.5rem", color: "#4ade80", letterSpacing: '10px' };

const reportBadge = (p: string) => ({ 
  padding: "6px 15px", borderRadius: "8px", fontSize: "0.75rem", 
  background: p.includes("Healthy") ? "rgba(74, 222, 128, 0.1)" : "rgba(248, 113, 113, 0.1)", 
  color: p.includes("Healthy") ? "#4ade80" : "#f87171", border: '1px solid' 
});

export default AdminPage;