import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


export const Component = () => {

  return (
    <Card>
    <CardHeader>
    <CardTitle>Product Roadmap < /CardTitle>
      < CardDescription > Upcoming features and releases < /CardDescription>
        < /CardHeader>
        < CardContent >
        <div className="relative" >
          <div className="absolute left-0 right-0 top-4 h-px bg-border" > </div>

            < div className = "flex justify-between" >
              <div className="relative pt-8 text-center w-1/4" >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-5 w-5 rounded-full bg-primary flex items-center justify-center" >
                  <div className="h-2 w-2 rounded-full bg-background" > </div>
                    < /div>
                    < Badge className = "mb-2" > Q1 2023 < /Badge>
                      < h4 className = "text-sm font-medium" > Core Platform < /h4>
                        < p className = "text-xs text-muted-foreground mt-1" >
                          Basic functionality and user management
                            < /p>
                            < /div>

                            < div className = "relative pt-8 text-center w-1/4" >
                              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-5 w-5 rounded-full bg-primary flex items-center justify-center" >
                                <div className="h-2 w-2 rounded-full bg-background" > </div>
                                  < /div>
                                  < Badge className = "mb-2" > Q2 2023 < /Badge>
                                    < h4 className = "text-sm font-medium" > Analytics < /h4>
                                      < p className = "text-xs text-muted-foreground mt-1" >
                                        Reporting and data visualization
                                          < /p>
                                          < /div>

                                          < div className = "relative pt-8 text-center w-1/4" >
                                            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center" >
                                              <div className="h-2 w-2 rounded-full bg-background" > </div>
                                                < /div>
                                                < Badge variant = "outline" className = "mb-2" >
                                                  Q3 2023
                                                    < /Badge>
                                                    < h4 className = "text-sm font-medium" > Integrations < /h4>
                                                      < p className = "text-xs text-muted-foreground mt-1" >
                                                        Third - party app connections
                                                          < /p>
                                                          < /div>

                                                          < div className = "relative pt-8 text-center w-1/4" >
                                                            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center" >
                                                              <div className="h-2 w-2 rounded-full bg-background" > </div>
                                                                < /div>
                                                                < Badge variant = "outline" className = "mb-2" >
                                                                  Q4 2023
                                                                    < /Badge>
                                                                    < h4 className = "text-sm font-medium" > AI Features < /h4>
                                                                      < p className = "text-xs text-muted-foreground mt-1" >
                                                                        Smart automation and predictions
                                                                          < /p>
                                                                          < /div>
                                                                          < /div>
                                                                          < /div>
                                                                          < /CardContent>
                                                                          < CardFooter >

                                                                          < /CardFooter>
                                                                          < /Card>
  );
};
