"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ApiTestPage() {
  const [statsResult, setStatsResult] = useState<string>("");
  const [leaderboardResult, setLeaderboardResult] = useState<string>("");

  const testStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStatsResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setStatsResult(`Error: ${error}`);
    }
  };

  const testLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setLeaderboardResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setLeaderboardResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <Button onClick={testStats} className="mr-4">Test Stats API</Button>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
            {statsResult || "Click button to test"}
          </pre>
        </div>
        
        <div>
          <Button onClick={testLeaderboard} className="mr-4">Test Leaderboard API</Button>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-96">
            {leaderboardResult || "Click button to test"}
          </pre>
        </div>
      </div>
    </div>
  );
}
