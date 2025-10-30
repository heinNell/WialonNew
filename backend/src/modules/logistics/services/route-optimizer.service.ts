import { Injectable, Logger } from '@nestjs/common';

interface OptimizationPoint {
  id: string;
  lat: number;
  lng: number;
  address?: string;
  priority?: string;
  scheduledTime?: Date;
  duration?: number;
}

interface OptimizationResult {
  sequence: any[];
  totalDistance: number;
  estimatedDuration: number;
  params: any;
}

@Injectable()
export class RouteOptimizerService {
  private readonly logger = new Logger(RouteOptimizerService.name);

  /**
   * Optimize route using various algorithms
   */
  async optimizeRoute(
    points: OptimizationPoint[],
    startPoint?: { lat: number; lng: number },
    options?: {
      algorithm?: 'nearest_neighbor' | 'genetic' | 'simulated_annealing';
      considerTime?: boolean;
      considerPriority?: boolean;
    },
  ): Promise<OptimizationResult> {
    const algorithm = options?.algorithm || 'nearest_neighbor';

    this.logger.log(
      `Optimizing route with ${points.length} points using ${algorithm}`,
    );

    let optimizedSequence: any[];

    switch (algorithm) {
      case 'genetic':
        optimizedSequence = await this.geneticAlgorithm(points, startPoint);
        break;
      case 'simulated_annealing':
        optimizedSequence = await this.simulatedAnnealing(points, startPoint);
        break;
      default:
        optimizedSequence = await this.nearestNeighbor(points, startPoint);
    }

    // Calculate total distance and duration
    const totalDistance = this.calculateTotalDistance(optimizedSequence);
    const estimatedDuration = this.estimateDuration(optimizedSequence);

    // Add estimated arrival times
    let currentTime = new Date();
    optimizedSequence = optimizedSequence.map((point, index) => {
      if (index > 0) {
        const distance = this.calculateDistance(
          optimizedSequence[index - 1],
          point,
        );
        const travelTime = (distance / 40) * 60; // Assuming 40 km/h avg speed
        currentTime = new Date(
          currentTime.getTime() +
            travelTime * 60000 +
            (point.duration || 15) * 60000,
        );
      }

      return {
        ...point,
        estimatedArrival: new Date(currentTime),
      };
    });

    return {
      sequence: optimizedSequence,
      totalDistance,
      estimatedDuration,
      params: {
        algorithm,
        pointsCount: points.length,
        optimizedAt: new Date(),
      },
    };
  }

  /**
   * Nearest Neighbor Algorithm (Greedy)
   */
  private async nearestNeighbor(
    points: OptimizationPoint[],
    startPoint?: { lat: number; lng: number },
  ): Promise<OptimizationPoint[]> {
    const optimized: OptimizationPoint[] = [];
    const remaining = [...points];
    let current = startPoint || points[0];

    // If startPoint provided, use it
    if (startPoint && startPoint !== points[0]) {
      // Start from custom point
    } else {
      optimized.push(remaining.shift()!);
      current = optimized[0];
    }

    while (remaining.length > 0) {
      let nearest: OptimizationPoint | null = null;
      let minDistance = Infinity;
      let nearestIndex = -1;

      remaining.forEach((point, index) => {
        const distance = this.calculateDistance(current, point);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = point;
          nearestIndex = index;
        }
      });

      if (nearest) {
        optimized.push(nearest);
        remaining.splice(nearestIndex, 1);
        current = nearest;
      }
    }

    return optimized;
  }

  /**
   * Genetic Algorithm (More optimal)
   */
  private async geneticAlgorithm(
    points: OptimizationPoint[],
    startPoint?: { lat: number; lng: number },
  ): Promise<OptimizationPoint[]> {
    // Simplified genetic algorithm
    const populationSize = 50;
    const generations = 100;
    const mutationRate = 0.1;

    let population = this.initializePopulation(points, populationSize);

    for (let gen = 0; gen < generations; gen++) {
      // Evaluate fitness
      const fitness = population.map((individual) =>
        this.calculateFitness(individual),
      );

      // Selection
      const selected = this.selection(population, fitness);

      // Crossover
      const offspring = this.crossover(selected);

      // Mutation
      population = this.mutation(offspring, mutationRate);
    }

    // Return best solution
    const fitness = population.map((individual) =>
      this.calculateFitness(individual),
    );
    const bestIndex = fitness.indexOf(Math.max(...fitness));

    return population[bestIndex];
  }

  /**
   * Simulated Annealing Algorithm
   */
  private async simulatedAnnealing(
    points: OptimizationPoint[],
    startPoint?: { lat: number; lng: number },
  ): Promise<OptimizationPoint[]> {
    let current = [...points];
    let best = [...current];
    let bestDistance = this.calculateTotalDistance(best);

    let temperature = 10000;
    const coolingRate = 0.995;

    while (temperature > 1) {
      // Generate neighbor solution
      const neighbor = this.generateNeighbor(current);
      const neighborDistance = this.calculateTotalDistance(neighbor);

      // Calculate acceptance probability
      const delta = neighborDistance - this.calculateTotalDistance(current);
      const acceptanceProbability =
        delta < 0 ? 1 : Math.exp(-delta / temperature);

      if (Math.random() < acceptanceProbability) {
        current = neighbor;

        if (neighborDistance < bestDistance) {
          best = [...neighbor];
          bestDistance = neighborDistance;
        }
      }

      temperature *= coolingRate;
    }

    return best;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number },
  ): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(point2.lat - point1.lat);
    const dLng = this.deg2rad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(point1.lat)) *
        Math.cos(this.deg2rad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateTotalDistance(points: OptimizationPoint[]): number {
    let total = 0;
    for (let i = 0; i < points.length - 1; i++) {
      total += this.calculateDistance(points[i], points[i + 1]);
    }
    return Math.round(total * 100) / 100;
  }

  private estimateDuration(points: OptimizationPoint[]): number {
    const distance = this.calculateTotalDistance(points);
    const avgSpeed = 40; // km/h
    const travelTime = (distance / avgSpeed) * 60; // minutes

    // Add task durations
    const taskTime = points.reduce(
      (sum, point) => sum + (point.duration || 15),
      0,
    );

    return Math.round(travelTime + taskTime);
  }

  // Genetic Algorithm helpers
  private initializePopulation(
    points: OptimizationPoint[],
    size: number,
  ): OptimizationPoint[][] {
    const population: OptimizationPoint[][] = [];
    for (let i = 0; i < size; i++) {
      const shuffled = [...points].sort(() => Math.random() - 0.5);
      population.push(shuffled);
    }
    return population;
  }

  private calculateFitness(individual: OptimizationPoint[]): number {
    const distance = this.calculateTotalDistance(individual);
    return 1 / (1 + distance); // Higher fitness for shorter routes
  }

  private selection(
    population: OptimizationPoint[][],
    fitness: number[],
  ): OptimizationPoint[][] {
    const selected: OptimizationPoint[][] = [];
    const totalFitness = fitness.reduce((sum, f) => sum + f, 0);

    for (let i = 0; i < population.length; i++) {
      const rand = Math.random() * totalFitness;
      let sum = 0;

      for (let j = 0; j < population.length; j++) {
        sum += fitness[j];
        if (sum > rand) {
          selected.push(population[j]);
          break;
        }
      }
    }

    return selected;
  }

  private crossover(population: OptimizationPoint[][]): OptimizationPoint[][] {
    const offspring: OptimizationPoint[][] = [];

    for (let i = 0; i < population.length - 1; i += 2) {
      const parent1 = population[i];
      const parent2 = population[i + 1];

      const cutPoint = Math.floor(Math.random() * parent1.length);
      const child1 = [
        ...parent1.slice(0, cutPoint),
        ...parent2.filter((p) => !parent1.slice(0, cutPoint).includes(p)),
      ];
      const child2 = [
        ...parent2.slice(0, cutPoint),
        ...parent1.filter((p) => !parent2.slice(0, cutPoint).includes(p)),
      ];

      offspring.push(child1, child2);
    }

    return offspring;
  }

  private mutation(
    population: OptimizationPoint[][],
    rate: number,
  ): OptimizationPoint[][] {
    return population.map((individual) => {
      if (Math.random() < rate) {
        const i = Math.floor(Math.random() * individual.length);
        const j = Math.floor(Math.random() * individual.length);
        [individual[i], individual[j]] = [individual[j], individual[i]];
      }
      return individual;
    });
  }

  private generateNeighbor(current: OptimizationPoint[]): OptimizationPoint[] {
    const neighbor = [...current];
    const i = Math.floor(Math.random() * neighbor.length);
    const j = Math.floor(Math.random() * neighbor.length);
    [neighbor[i], neighbor[j]] = [neighbor[j], neighbor[i]];
    return neighbor;
  }
}
