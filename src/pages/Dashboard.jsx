
import { useState, useEffect } from "react";
import { FloorSection } from "@/components/FloorSection";
import { NotificationPanel } from "@/components/NotificationPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const [floorsData, setFloorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFloorsData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-destructive">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      <main className="lg:w-2/3 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Floors & Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {floorsData.map((floor) => (
              <FloorSection key={floor.floorNumber} floor={floor.floorNumber} rooms={floor.rooms} />
            ))}
          </CardContent>
        </Card>
      </main>
      <aside className="lg:w-1/3">
        <NotificationPanel floorsData={floorsData} />
      </aside>
    </div>
  );
}
