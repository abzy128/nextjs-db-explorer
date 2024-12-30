import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    function fibonacci(n: number): number {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    }
  
    function generateCpuLoad(durationInSeconds: number) {
      const endTime = Date.now() + durationInSeconds * 1000;
      while (Date.now() < endTime) {
        fibonacci(35);
      }
    }
  
    console.log('Generating CPU load...');
    generateCpuLoad(300);
  
    return new Response(
      JSON.stringify({ message: 'CPU load generated for 5 seconds.' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  