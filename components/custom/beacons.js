import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from 'next/link';


const Beacon = ({ beacon }) => {
  return (
    <Card className="w-[350px] my-4">
      <CardContent>
        <h2>User {beacon.user_id}</h2>
        <p>{beacon.content}</p>
        <small>{new Date(beacon.timestamp).toLocaleString()}</small>
      </CardContent>
      <CardFooter className="flex justify-between">
       <Link href="/chat" passHref> 
          <Button asChild> 
            <button type="submit">Chat</button> 
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default Beacon;
