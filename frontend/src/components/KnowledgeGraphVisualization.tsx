import React, { useEffect, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network.js";
import type { DanceKnowledge } from "../data/danceKnowledge";
import { Loader2, ZoomIn, ZoomOut, Home } from "lucide-react";

interface KnowledgeGraphProps {
  danceKnowledge: DanceKnowledge;
  danceName: string;
}

export const KnowledgeGraphVisualization: React.FC<KnowledgeGraphProps> = ({
  danceKnowledge,
  danceName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    setIsLoading(true);

    // Build graph data from dance knowledge
    const nodes = new DataSet<any>([
      {
        id: "dance",
        label: danceName,
        title: `<b>${danceName}</b>\n${danceKnowledge.overview.substring(0, 100)}...`,
        color: {
          background: "#f0c96d",
          border: "#d9a856",
          highlight: {
            background: "#f5d88a",
            border: "#e6b870",
          },
        },
        font: {
          color: "#1a1a1a",
          size: 20,
          bold: { color: "#1a1a1a" },
        },
        shape: "box",
        borderWidth: 3,
        size: 40,
      },
    ]);

    // Color scheme for different categories
    const categoryColors: Record<string, { background: string; border: string }> = {
      mudra: { background: "#e8b4b8", border: "#c97d85" }, // Rose
      lineage: { background: "#b8d4e8", border: "#5a8cb3" }, // Blue
      artist: { background: "#d4e8b8", border: "#7fb37d" }, // Green
      institution: { background: "#e8d4b8", border: "#b39651" }, // Tan
      musical: { background: "#dab8e8", border: "#9d5ab3" }, // Purple
      philosophy: { background: "#e8c8b8", border: "#b37d5a" }, // Terracotta
    };

    // Add Mudra nodes
    danceKnowledge.majorSchoolsOrLineages?.forEach((lineage: string, index: number) => {
      nodes.add({
        id: `lineage_${index}`,
        label: lineage,
        title: `<b>Lineage/School:</b> ${lineage}`,
        color: categoryColors.lineage,
        font: { color: "#1a1a1a", size: 12 },
        shape: "circle",
        size: 25,
      });
    });

    // Add Notable Exponents nodes
    const exponents = danceKnowledge.notableExponents?.slice(0, 6) || [];
    exponents.forEach((exponent: string, index: number) => {
      const displayName =
        exponent.length > 20 ? exponent.substring(0, 17) + "..." : exponent;
      nodes.add({
        id: `artist_${index}`,
        label: displayName,
        title: `<b>Notable Artist:</b> ${exponent}`,
        color: categoryColors.artist,
        font: { color: "#1a1a1a", size: 11 },
        shape: "circle",
        size: 22,
      });
    });

    // Add Institutions nodes
    const institutions = danceKnowledge.institutionsAndFestivals?.slice(0, 5) || [];
    institutions.forEach((institution: string, index: number) => {
      const displayName =
        institution.length > 25
          ? institution.substring(0, 22) + "..."
          : institution;
      nodes.add({
        id: `institution_${index}`,
        label: displayName,
        title: `<b>Institution/Festival:</b> ${institution}`,
        color: categoryColors.institution,
        font: { color: "#1a1a1a", size: 10 },
        shape: "circle",
        size: 20,
      });
    });

    // Add philosophical concepts
    const philosophy = danceKnowledge.philosophyAndAesthetics?.slice(0, 4) || [];
    philosophy.forEach((concept: string, index: number) => {
      const displayName =
        concept.length > 20 ? concept.substring(0, 17) + "..." : concept;
      nodes.add({
        id: `philosophy_${index}`,
        label: displayName,
        title: `<b>Philosophy:</b> ${concept}`,
        color: categoryColors.philosophy,
        font: { color: "#1a1a1a", size: 10 },
        shape: "circle",
        size: 18,
      });
    });

    // Build edges
    const edges = new DataSet<any>([]);

    // Connect lineages to dance
    danceKnowledge.majorSchoolsOrLineages?.forEach((_: string, index: number) => {
      edges.add({
        from: "dance",
        to: `lineage_${index}`,
        color: { color: "#a0826d", highlight: "#d9a856" },
        width: 2,
        physics: true,
      });
    });

    // Connect artists to lineages (distribute them)
    exponents.forEach((_: string, index: number) => {
      const lineageIndex = index % danceKnowledge.majorSchoolsOrLineages!.length;
      edges.add({
        from: `lineage_${lineageIndex}`,
        to: `artist_${index}`,
        color: { color: "#9b9b9b", highlight: "#d9a856" },
        width: 1,
      });
    });

    // Connect institutions to dance
    institutions.forEach((_: string, index: number) => {
      edges.add({
        from: "dance",
        to: `institution_${index}`,
        color: { color: "#a0826d", highlight: "#d9a856" },
        width: 2,
        dashes: true,
      });
    });

    // Connect philosophy to dance
    philosophy.forEach((_: string, index: number) => {
      edges.add({
        from: "dance",
        to: `philosophy_${index}`,
        color: { color: "#a0826d", highlight: "#d9a856" },
        width: 1.5,
        dashes: false,
      });
    });

    // Configure network options
    const options: any = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based",
        forceAtlas2Based: {
          gravitationalConstant: -30,
          centralGravity: 0.005,
          springLength: 150,
          springConstant: 0.08,
          damping: 0.5,
        },
        maxVelocity: 50,
        timestep: 0.35,
        stabilization: {
          iterations: 150,
          fit: true,
          updateInterval: 25,
        },
      },
      interaction: {
        navigationButtons: false,
        keyboard: true,
        hover: true,
      },
      nodes: {
        borderWidthSelected: 4,
        shadow: {
          enabled: true,
          color: "rgba(0, 0, 0, 0.2)",
          size: 10,
          x: 3,
          y: 3,
        },
      },
      edges: {
        shadow: {
          enabled: true,
          color: "rgba(0, 0, 0, 0.1)",
          size: 5,
          x: 2,
          y: 2,
        },
        smooth: {
          enabled: true,
          type: "continuous",
          forceDirection: "none",
        },
      },
    };

    // Initialize network
    const data = {
      nodes: nodes,
      edges: edges,
    };

    if (containerRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        data,
        options
      );

      // Handle stabilization complete
      networkRef.current.once("stabilizationIterationsDone", () => {
        if (networkRef.current) {
          networkRef.current.setOptions({ physics: false });
          setIsLoading(false);
        }
      });

      // Fallback timeout in case stabilization doesn't fire
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => {
        clearTimeout(timeout);
        if (networkRef.current) {
          networkRef.current.destroy();
        }
      };
    }
  }, [danceKnowledge, danceName]);

  const handleZoomIn = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({
        scale: currentScale * 1.2,
      });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const currentScale = networkRef.current.getScale();
      networkRef.current.moveTo({
        scale: currentScale * 0.8,
      });
    }
  };

  const handleFitView = () => {
    if (networkRef.current) {
      networkRef.current.fit({
        animation: {
          duration: 500,
          easingFunction: "easeInOutQuad",
        },
      });
    }
  };

  return (
    <div className="relative space-y-4">
      {/* Legend */}
      <div className="grid grid-cols-2 gap-3 px-4 text-xs md:grid-cols-3 lg:grid-cols-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-[#f0c96d] ring-2 ring-[#d9a856]" />
          <span className="text-muted-foreground">Dance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#b8d4e8] ring-2 ring-[#5a8cb3]" />
          <span className="text-muted-foreground">Lineage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#d4e8b8] ring-2 ring-[#7fb37d]" />
          <span className="text-muted-foreground">Artist</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#e8d4b8] ring-2 ring-[#b39651]" />
          <span className="text-muted-foreground">Institution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#e8c8b8] ring-2 ring-[#b37d5a]" />
          <span className="text-muted-foreground">Philosophy</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 px-4">
        <button
          onClick={handleZoomIn}
          className="rounded-lg bg-[#f0c96d] p-2 text-[#1a1a1a] hover:bg-[#f5d88a] transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="rounded-lg bg-[#f0c96d] p-2 text-[#1a1a1a] hover:bg-[#f5d88a] transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={handleFitView}
          className="rounded-lg bg-[#f0c96d] p-2 text-[#1a1a1a] hover:bg-[#f5d88a] transition-colors"
          title="Fit to view"
        >
          <Home className="h-4 w-4" />
        </button>
      </div>

      {/* Graph Container */}
      <div className="relative h-[600px] w-full overflow-hidden rounded-xl border border-gold-subtle bg-gradient-to-br from-background to-background/50">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#f0c96d]" />
              <p className="text-sm text-muted-foreground">Building knowledge graph...</p>
            </div>
          </div>
        )}
        <div
          ref={containerRef}
          className="h-full w-full"
          style={{
            background: "linear-gradient(135deg, rgba(240, 201, 109, 0.03) 0%, rgba(234, 220, 178, 0.03) 100%)",
          }}
        />
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-gold-subtle bg-card/50 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">💡 Tip:</p>
        <p>
          Drag nodes to explore • Hover over nodes for details • Use controls to zoom and navigate
        </p>
      </div>
    </div>
  );
};

export default KnowledgeGraphVisualization;
