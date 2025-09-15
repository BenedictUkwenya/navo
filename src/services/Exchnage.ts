const API_BASE = "/api/v1/rate";

// Static JSON data - no dynamic generation
export class ExchangeRateAPI {
  // Simulate network delay
  private static delay(ms = 500): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Static current rate data
  private static currentRateData = {
    rate: 1250.75,
    current_rate: 1250.75,
    change: 2.25,
    last_updated: "2025-01-15T14:30:00.000Z",
    updated_at: "2025-01-15T14:30:00.000Z",
  };

  // Static chart data - 30 days
  private static chartData = {
    period: "30 days",
    data: [
      {
        date: "2024-12-16",
        rate: 1200.25,
        timestamp: "2024-12-16T10:30:00.000Z",
      },
      {
        date: "2024-12-17",
        rate: 1205.5,
        timestamp: "2024-12-17T11:15:00.000Z",
      },
      {
        date: "2024-12-18",
        rate: 1198.75,
        timestamp: "2024-12-18T09:45:00.000Z",
      },
      {
        date: "2024-12-19",
        rate: 1210.3,
        timestamp: "2024-12-19T14:20:00.000Z",
      },
      {
        date: "2024-12-20",
        rate: 1215.8,
        timestamp: "2024-12-20T16:10:00.000Z",
      },
      {
        date: "2024-12-21",
        rate: 1208.9,
        timestamp: "2024-12-21T12:30:00.000Z",
      },
      {
        date: "2024-12-22",
        rate: 1220.45,
        timestamp: "2024-12-22T13:45:00.000Z",
      },
      {
        date: "2024-12-23",
        rate: 1225.6,
        timestamp: "2024-12-23T15:20:00.000Z",
      },
      {
        date: "2024-12-24",
        rate: 1218.35,
        timestamp: "2024-12-24T10:15:00.000Z",
      },
      {
        date: "2024-12-25",
        rate: 1230.75,
        timestamp: "2024-12-25T11:30:00.000Z",
      },
      {
        date: "2024-12-26",
        rate: 1235.2,
        timestamp: "2024-12-26T14:45:00.000Z",
      },
      {
        date: "2024-12-27",
        rate: 1228.9,
        timestamp: "2024-12-27T16:20:00.000Z",
      },
      {
        date: "2024-12-28",
        rate: 1240.15,
        timestamp: "2024-12-28T09:30:00.000Z",
      },
      {
        date: "2024-12-29",
        rate: 1245.8,
        timestamp: "2024-12-29T12:15:00.000Z",
      },
      {
        date: "2024-12-30",
        rate: 1238.45,
        timestamp: "2024-12-30T15:40:00.000Z",
      },
      {
        date: "2024-12-31",
        rate: 1250.3,
        timestamp: "2024-12-31T17:00:00.000Z",
      },
      {
        date: "2025-01-01",
        rate: 1248.75,
        timestamp: "2025-01-01T10:00:00.000Z",
      },
      {
        date: "2025-01-02",
        rate: 1252.9,
        timestamp: "2025-01-02T11:30:00.000Z",
      },
      {
        date: "2025-01-03",
        rate: 1247.6,
        timestamp: "2025-01-03T13:15:00.000Z",
      },
      {
        date: "2025-01-04",
        rate: 1255.4,
        timestamp: "2025-01-04T14:45:00.000Z",
      },
      {
        date: "2025-01-05",
        rate: 1249.85,
        timestamp: "2025-01-05T16:20:00.000Z",
      },
      {
        date: "2025-01-06",
        rate: 1258.2,
        timestamp: "2025-01-06T09:45:00.000Z",
      },
      {
        date: "2025-01-07",
        rate: 1251.75,
        timestamp: "2025-01-07T12:30:00.000Z",
      },
      {
        date: "2025-01-08",
        rate: 1260.45,
        timestamp: "2025-01-08T15:10:00.000Z",
      },
      {
        date: "2025-01-09",
        rate: 1254.3,
        timestamp: "2025-01-09T11:20:00.000Z",
      },
      {
        date: "2025-01-10",
        rate: 1262.8,
        timestamp: "2025-01-10T14:35:00.000Z",
      },
      {
        date: "2025-01-11",
        rate: 1257.95,
        timestamp: "2025-01-11T16:45:00.000Z",
      },
      {
        date: "2025-01-12",
        rate: 1265.2,
        timestamp: "2025-01-12T10:15:00.000Z",
      },
      {
        date: "2025-01-13",
        rate: 1259.6,
        timestamp: "2025-01-13T13:40:00.000Z",
      },
      {
        date: "2025-01-14",
        rate: 1267.85,
        timestamp: "2025-01-14T15:25:00.000Z",
      },
      {
        date: "2025-01-15",
        rate: 1250.75,
        timestamp: "2025-01-15T14:30:00.000Z",
      },
    ],
    summary: {
      totalEntries: 31,
      latestRate: 1250.75,
      oldestRate: 1200.25,
      averageRate: 1238.47,
    },
  };

  // Static history data
  private static historyData = [
    {
      id: "1",
      rate: 1250.75,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-15T14:30:00.000Z",
      notes: "Market adjustment",
      is_active: true,
      change: 2.25,
    },
    {
      id: "2",
      rate: 1248.5,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-15T08:30:00.000Z",
      notes: "Morning update",
      is_active: false,
      change: -0.5,
    },
    {
      id: "3",
      rate: 1245.3,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-14T16:20:00.000Z",
      notes: "End of day rate",
      is_active: false,
      change: -1.2,
    },
    {
      id: "4",
      rate: 1242.8,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-13T15:45:00.000Z",
      notes: "Weekly adjustment",
      is_active: false,
      change: 0.8,
    },
    {
      id: "5",
      rate: 1240.15,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-12T12:30:00.000Z",
      notes: "Market correction",
      is_active: false,
      change: -2.1,
    },
    {
      id: "6",
      rate: 1238.9,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-11T14:15:00.000Z",
      notes: "Routine update",
      is_active: false,
      change: 1.5,
    },
    {
      id: "7",
      rate: 1235.6,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-10T11:20:00.000Z",
      notes: "Central bank rate",
      is_active: false,
      change: -0.8,
    },
    {
      id: "8",
      rate: 1232.45,
      from_currency: "NGN",
      to_currency: "GBP",
      created_at: "2025-01-09T16:40:00.000Z",
      notes: "Market volatility",
      is_active: false,
      change: 2.3,
    },
  ];

  static async getCurrentRate(): Promise<any> {
    await this.delay(300);
    return this.currentRateData;
  }

  static async createRate(rateData: any): Promise<any> {
    await this.delay(800);

    console.log("Mock API: Creating rate", rateData);

    // Create new history entry
    const newHistoryEntry = {
      id: (this.historyData.length + 1).toString(),
      rate: rateData.rate,
      from_currency: rateData.from_currency,
      to_currency: rateData.to_currency,
      created_at: new Date().toISOString(),
      notes: rateData.notes || "Rate created",
      is_active: true,
      change: 1.5, // Static change value
    };

    // Update current rate
    this.currentRateData.rate = rateData.rate;
    this.currentRateData.current_rate = rateData.rate;
    this.currentRateData.last_updated = new Date().toISOString();
    this.currentRateData.updated_at = new Date().toISOString();

    // Mark previous entries as inactive and add new one
    this.historyData.forEach((entry) => (entry.is_active = false));
    this.historyData.unshift(newHistoryEntry);

    return {
      success: true,
      message: "Exchange rate created successfully",
      data: newHistoryEntry,
    };
  }

  static async updateRate(rateData: any): Promise<any> {
    await this.delay(600);

    console.log("Mock API: Updating rate", rateData);

    // Create new history entry
    const newHistoryEntry = {
      id: (this.historyData.length + 1).toString(),
      rate: rateData.rate,
      from_currency: rateData.from_currency,
      to_currency: rateData.to_currency,
      created_at: new Date().toISOString(),
      notes: rateData.notes || "Rate updated",
      is_active: true,
      change: 0.8, // Static change value
    };

    // Update current rate
    this.currentRateData.rate = rateData.rate;
    this.currentRateData.current_rate = rateData.rate;
    this.currentRateData.last_updated = new Date().toISOString();
    this.currentRateData.updated_at = new Date().toISOString();

    // Mark previous entries as inactive and add new one
    this.historyData.forEach((entry) => (entry.is_active = false));
    this.historyData.unshift(newHistoryEntry);

    return {
      success: true,
      message: "Exchange rate updated successfully",
      data: newHistoryEntry,
    };
  }

  static async getRateHistory(page = 1, limit = 10): Promise<any> {
    await this.delay(400);

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = this.historyData.slice(startIndex, endIndex);

    return {
      data: paginatedHistory,
      history: paginatedHistory,
      total: this.historyData.length,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(this.historyData.length / limit),
        total: this.historyData.length,
        per_page: limit,
      },
    };
  }

  // Static chart data - no dynamic generation
  static async getChartData(days = 30): Promise<any> {
    await this.delay(500);

    console.log(`Mock API: Getting chart data for ${days} days`);

    // Return different data based on days requested
    if (days === 7) {
      const last7Days = this.chartData.data.slice(-7);
      return {
        period: "7 days",
        data: last7Days,
        summary: {
          totalEntries: 7,
          latestRate: 1250.75,
          oldestRate: 1257.95,
          averageRate: 1259.18,
        },
      };
    } else if (days === 90) {
      // For 90 days, we'll extend the data with some additional entries
      const extended90Days = [
        ...this.generate90DayData(),
        ...this.chartData.data,
      ];
      return {
        period: "90 days",
        data: extended90Days,
        summary: {
          totalEntries: 90,
          latestRate: 1250.75,
          oldestRate: 1180.25,
          averageRate: 1225.47,
        },
      };
    }

    // Default 30 days
    return this.chartData;
  }

  // Generate additional static data for 90-day view
  private static generate90DayData() {
    return [
      {
        date: "2024-10-17",
        rate: 1180.25,
        timestamp: "2024-10-17T10:30:00.000Z",
      },
      {
        date: "2024-10-18",
        rate: 1185.5,
        timestamp: "2024-10-18T11:15:00.000Z",
      },
      {
        date: "2024-10-19",
        rate: 1178.75,
        timestamp: "2024-10-19T09:45:00.000Z",
      },
      {
        date: "2024-10-20",
        rate: 1190.3,
        timestamp: "2024-10-20T14:20:00.000Z",
      },
      {
        date: "2024-10-21",
        rate: 1195.8,
        timestamp: "2024-10-21T16:10:00.000Z",
      },
      {
        date: "2024-10-22",
        rate: 1188.9,
        timestamp: "2024-10-22T12:30:00.000Z",
      },
      {
        date: "2024-10-23",
        rate: 1200.45,
        timestamp: "2024-10-23T13:45:00.000Z",
      },
      {
        date: "2024-10-24",
        rate: 1205.6,
        timestamp: "2024-10-24T15:20:00.000Z",
      },
      {
        date: "2024-10-25",
        rate: 1198.35,
        timestamp: "2024-10-25T10:15:00.000Z",
      },
      {
        date: "2024-10-26",
        rate: 1210.75,
        timestamp: "2024-10-26T11:30:00.000Z",
      },
      {
        date: "2024-10-27",
        rate: 1215.2,
        timestamp: "2024-10-27T14:45:00.000Z",
      },
      {
        date: "2024-10-28",
        rate: 1208.9,
        timestamp: "2024-10-28T16:20:00.000Z",
      },
      {
        date: "2024-10-29",
        rate: 1220.15,
        timestamp: "2024-10-29T09:30:00.000Z",
      },
      {
        date: "2024-10-30",
        rate: 1225.8,
        timestamp: "2024-10-30T12:15:00.000Z",
      },
      {
        date: "2024-10-31",
        rate: 1218.45,
        timestamp: "2024-10-31T15:40:00.000Z",
      },
      {
        date: "2024-11-01",
        rate: 1230.3,
        timestamp: "2024-11-01T17:00:00.000Z",
      },
      {
        date: "2024-11-02",
        rate: 1228.75,
        timestamp: "2024-11-02T10:00:00.000Z",
      },
      {
        date: "2024-11-03",
        rate: 1232.9,
        timestamp: "2024-11-03T11:30:00.000Z",
      },
      {
        date: "2024-11-04",
        rate: 1227.6,
        timestamp: "2024-11-04T13:15:00.000Z",
      },
      {
        date: "2024-11-05",
        rate: 1235.4,
        timestamp: "2024-11-05T14:45:00.000Z",
      },
      {
        date: "2024-11-06",
        rate: 1229.85,
        timestamp: "2024-11-06T16:20:00.000Z",
      },
      {
        date: "2024-11-07",
        rate: 1238.2,
        timestamp: "2024-11-07T09:45:00.000Z",
      },
      {
        date: "2024-11-08",
        rate: 1231.75,
        timestamp: "2024-11-08T12:30:00.000Z",
      },
      {
        date: "2024-11-09",
        rate: 1240.45,
        timestamp: "2024-11-09T15:10:00.000Z",
      },
      {
        date: "2024-11-10",
        rate: 1234.3,
        timestamp: "2024-11-10T11:20:00.000Z",
      },
      {
        date: "2024-11-11",
        rate: 1242.8,
        timestamp: "2024-11-11T14:35:00.000Z",
      },
      {
        date: "2024-11-12",
        rate: 1237.95,
        timestamp: "2024-11-12T16:45:00.000Z",
      },
      {
        date: "2024-11-13",
        rate: 1245.2,
        timestamp: "2024-11-13T10:15:00.000Z",
      },
      {
        date: "2024-11-14",
        rate: 1239.6,
        timestamp: "2024-11-14T13:40:00.000Z",
      },
      {
        date: "2024-11-15",
        rate: 1247.85,
        timestamp: "2024-11-15T15:25:00.000Z",
      },
      {
        date: "2024-11-16",
        rate: 1241.3,
        timestamp: "2024-11-16T17:10:00.000Z",
      },
      {
        date: "2024-11-17",
        rate: 1249.75,
        timestamp: "2024-11-17T09:20:00.000Z",
      },
      {
        date: "2024-11-18",
        rate: 1243.9,
        timestamp: "2024-11-18T12:45:00.000Z",
      },
      {
        date: "2024-11-19",
        rate: 1251.6,
        timestamp: "2024-11-19T14:30:00.000Z",
      },
      {
        date: "2024-11-20",
        rate: 1245.85,
        timestamp: "2024-11-20T16:15:00.000Z",
      },
      {
        date: "2024-11-21",
        rate: 1253.4,
        timestamp: "2024-11-21T11:40:00.000Z",
      },
      {
        date: "2024-11-22",
        rate: 1247.7,
        timestamp: "2024-11-22T13:25:00.000Z",
      },
      {
        date: "2024-11-23",
        rate: 1255.2,
        timestamp: "2024-11-23T15:50:00.000Z",
      },
      {
        date: "2024-11-24",
        rate: 1249.95,
        timestamp: "2024-11-24T10:35:00.000Z",
      },
      {
        date: "2024-11-25",
        rate: 1257.8,
        timestamp: "2024-11-25T12:20:00.000Z",
      },
      {
        date: "2024-11-26",
        rate: 1251.45,
        timestamp: "2024-11-26T14:55:00.000Z",
      },
      {
        date: "2024-11-27",
        rate: 1259.3,
        timestamp: "2024-11-27T16:40:00.000Z",
      },
      {
        date: "2024-11-28",
        rate: 1253.65,
        timestamp: "2024-11-28T09:15:00.000Z",
      },
      {
        date: "2024-11-29",
        rate: 1261.9,
        timestamp: "2024-11-29T11:50:00.000Z",
      },
      {
        date: "2024-11-30",
        rate: 1255.2,
        timestamp: "2024-11-30T13:35:00.000Z",
      },
      {
        date: "2024-12-01",
        rate: 1263.75,
        timestamp: "2024-12-01T15:20:00.000Z",
      },
      {
        date: "2024-12-02",
        rate: 1257.4,
        timestamp: "2024-12-02T17:05:00.000Z",
      },
      {
        date: "2024-12-03",
        rate: 1265.6,
        timestamp: "2024-12-03T10:25:00.000Z",
      },
      {
        date: "2024-12-04",
        rate: 1259.85,
        timestamp: "2024-12-04T12:10:00.000Z",
      },
      {
        date: "2024-12-05",
        rate: 1267.3,
        timestamp: "2024-12-05T14:45:00.000Z",
      },
      {
        date: "2024-12-06",
        rate: 1261.95,
        timestamp: "2024-12-06T16:30:00.000Z",
      },
      {
        date: "2024-12-07",
        rate: 1269.8,
        timestamp: "2024-12-07T09:55:00.000Z",
      },
      {
        date: "2024-12-08",
        rate: 1263.25,
        timestamp: "2024-12-08T11:40:00.000Z",
      },
      {
        date: "2024-12-09",
        rate: 1271.5,
        timestamp: "2024-12-09T13:15:00.000Z",
      },
      {
        date: "2024-12-10",
        rate: 1265.7,
        timestamp: "2024-12-10T15:00:00.000Z",
      },
      {
        date: "2024-12-11",
        rate: 1273.2,
        timestamp: "2024-12-11T16:45:00.000Z",
      },
      {
        date: "2024-12-12",
        rate: 1267.85,
        timestamp: "2024-12-12T10:20:00.000Z",
      },
      {
        date: "2024-12-13",
        rate: 1275.4,
        timestamp: "2024-12-13T12:05:00.000Z",
      },
      {
        date: "2024-12-14",
        rate: 1269.6,
        timestamp: "2024-12-14T14:40:00.000Z",
      },
      {
        date: "2024-12-15",
        rate: 1277.85,
        timestamp: "2024-12-15T16:25:00.000Z",
      },
    ];
  }
}
