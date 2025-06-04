import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Learn more about our company and mission
          </p>
        </div>
        
        <div className="grid gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Story</CardTitle>
              <CardDescription>How we got started and where we're going</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="leading-7">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
                eu lorem et ultricies. In porta lorem at dui semper, non ullamcorper
                tortor pretium. Donec sed dolor eget enim dapibus ultrices. Nullam
                tempus ligula a nulla pretium, at suscipit elit elementum.
              </p>
              <p className="leading-7 mt-4">
                Sed euismod eu lorem et ultricies. In porta lorem at dui semper, non
                ullamcorper tortor pretium. Donec sed dolor eget enim dapibus ultrices.
                Nullam tempus ligula a nulla pretium, at suscipit elit elementum.
              </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
                  eu lorem et ultricies. In porta lorem at dui semper, non ullamcorper
                  tortor pretium. Donec sed dolor eget enim dapibus ultrices.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-7">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
                  eu lorem et ultricies. In porta lorem at dui semper, non ullamcorper
                  tortor pretium. Donec sed dolor eget enim dapibus ultrices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}