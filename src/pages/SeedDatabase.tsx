
import { Button } from '@/components/ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const seedDatabase = httpsCallable(functions, 'seedDatabase');

export default function SeedDatabase() {
  const handleSeed = async () => {
    try {
      const result = await seedDatabase();
      console.log(result.data);
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  return (
    <div>
      <h1>Seed Database</h1>
      <p>Click the button to seed the database with sample data.</p>
      <Button onClick={handleSeed}>Seed Database</Button>
    </div>
  );
}
