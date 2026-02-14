import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart3 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 space-y-6 text-center">
          <h1 className="text-3xl font-bold text-foreground">Anonymous Form</h1>
          <p className="text-muted-foreground">
            Collect feedback anonymously. No names, no emails — just honest answers.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link to="/form">
                <FileText className="h-5 w-5 mr-2" /> Fill Out Form
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/admin">
                <BarChart3 className="h-5 w-5 mr-2" /> View Responses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
