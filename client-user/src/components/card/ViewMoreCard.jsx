import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

/**
 * used for showing view more card
 * @returns view more card component
 */
export const ViewMoreCard = () => {
  return (
    <Card className="w-60 grid place-content-center bg-muted">
      <CardContent>
        <Button>View More</Button>
      </CardContent>
    </Card>
  );
};
