import { NextResponse } from 'next/server';
import { Worker, isMainThread, parentPort } from 'worker_threads';

function generateLoad(duration: number) {
    if (isMainThread) {
        const numWorkers = require('os').cpus().length;
        console.log(`Spawning ${numWorkers} workers...`);

        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker(__filename);
            worker.on('message', (msg) => console.log(`Worker ${i} finished: ${msg}`));
        }
    } else {
        function computeLoad() {
            const start = Date.now();
            while (Date.now() - start < duration) {
                fibonacci(35);
            }
            parentPort?.postMessage('done');
        }

        function fibonacci(n: number): number {
            if (n <= 1) return n;
            return fibonacci(n - 1) + fibonacci(n - 2);
        }

        computeLoad();
    }
}

export async function GET() {
    try {
        console.log('GENERATING LOAD...');
        generateLoad(30_000);
        return NextResponse.json({ message: 'Load generation started' });
    } catch (error) {
        console.error('Error generating load:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}