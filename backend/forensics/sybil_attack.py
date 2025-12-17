import json
import csv
from datetime import datetime
from typing import Dict, List, Any
import math


class SybilAttackDetector:

    def __init__(self):
        self.results = {}
        self.threat_level = "Unknown"
        self.confidence_score = 0.0

    # ---------------------------------------------------------
    # MAIN ANALYSIS
    # ---------------------------------------------------------
    def analyze(self, filepath: str) -> Dict[str, Any]:

        try:
            data = self._read_file(filepath)

            # Convert numeric fields to float
            data = self._normalize_data(data)

            # Step 1: Group messages by PSN
            vehicles = self._group_by_psn(data)

            # Step 2: Detect cloned trajectories
            cloned_nodes = self._detect_cloned_paths(vehicles)

            # Step 3: Detect co-location conflicts
            position_conflicts = self._detect_same_position_same_time(data)

            # Step 4: Detect identical behavior patterns
            behavior_clones = self._detect_behavior_clones(vehicles)

            # Build final results
            self.results = {
                "total_unique_vehicles": len(vehicles),
                "cloned_trajectory_nodes": cloned_nodes,
                "position_conflicts": position_conflicts,
                "behavior_clones": behavior_clones,
                "threat_indicators": self._generate_indicators(
                    cloned_nodes,
                    position_conflicts,
                    behavior_clones
                )
            }

            # Threat rating
            self.threat_level, self.confidence_score = \
                self._rate_threat_level(cloned_nodes, position_conflicts, behavior_clones)

            return self._compile_report(filepath)

        except Exception as e:
            return {
                "error": True,
                "message": str(e),
                "timestamp": datetime.now().isoformat()
            }

    # ---------------------------------------------------------
    # READ FILE
    # ---------------------------------------------------------
    def _read_file(self, filepath: str) -> Any:
        ext = filepath.split('.')[-1].lower()

        if ext == 'csv':
            with open(filepath, 'r') as f:
                return list(csv.DictReader(f))

        elif ext in ['txt', 'log']:
            with open(filepath, 'r') as f:
                return f.readlines()

        else:
            raise ValueError("Unsupported format (use CSV)")

    # ---------------------------------------------------------
    # NORMALIZATION
    # ---------------------------------------------------------
    def _normalize_data(self, rows):
        """Convert numeric fields to floats for math operations"""
        numeric_fields = ["x", "y", "heading", "spd", "localtime", "instant_accel"]

        for row in rows:
            for f in numeric_fields:
                try:
                    row[f] = float(row[f])
                except:
                    row[f] = None

        return rows

    # ---------------------------------------------------------
    # GROUP BY PSN
    # ---------------------------------------------------------
    def _group_by_psn(self, data):
        vehicles = {}
        for row in data:
            psn = row["PSN"]
            vehicles.setdefault(psn, []).append(row)
        return vehicles

    # ---------------------------------------------------------
    # 1. DETECT CLONED TRAJECTORIES (same path, different PSN)
    # ---------------------------------------------------------
    def _detect_cloned_paths(self, vehicles) -> List:
        cloned = []

        psns = list(vehicles.keys())
        n = len(psns)

        for i in range(n):
            for j in range(i + 1, n):

                psn1, psn2 = psns[i], psns[j]
                path1, path2 = vehicles[psn1], vehicles[psn2]

                if self._paths_too_similar(path1, path2):
                    cloned.append((psn1, psn2))

        return cloned

    def _paths_too_similar(self, p1, p2):
        """Two vehicles moving with identical location-speed-heading = clone"""
        count = 0

        for r1, r2 in zip(p1, p2):
            if abs(r1["x"] - r2["x"]) < 3 and \
               abs(r1["y"] - r2["y"]) < 3 and \
               abs(r1["spd"] - r2["spd"]) < 0.5 and \
               abs(r1["heading"] - r2["heading"]) < 0.3:
                count += 1

        return count >= 5   # cloned if ≥5 matching samples

    # ---------------------------------------------------------
    # 2. SAME LOCATION SAME TIME (IMPOSSIBLE - SYBIL)
    # ---------------------------------------------------------
    def _detect_same_position_same_time(self, data):

        suspicious = []
        time_groups = {}

        for row in data:
            t = round(row["localtime"], 1)
            time_groups.setdefault(t, []).append(row)

        for t, rows in time_groups.items():

            for i in range(len(rows)):
                for j in range(i + 1, len(rows)):
                    r1, r2 = rows[i], rows[j]

                    dist = math.dist((r1["x"], r1["y"]), (r2["x"], r2["y"]))

                    if dist < 2 and r1["PSN"] != r2["PSN"]:  # two vehicles cannot overlap
                        suspicious.append({
                            "time": t,
                            "psn1": r1["PSN"],
                            "psn2": r2["PSN"],
                            "distance": dist
                        })

        return suspicious

    # ---------------------------------------------------------
    # 3. SAME SPEED + SAME HEADING + SAME ACCEL → BEHAVIOR CLONES
    # ---------------------------------------------------------
    def _detect_behavior_clones(self, vehicles):

        clones = []

        for psn, rows in vehicles.items():

            pattern = [(r["spd"], r["heading"], r["instant_accel"]) for r in rows]

            for psn2, rows2 in vehicles.items():
                if psn == psn2:
                    continue

                pattern2 = [(r["spd"], r["heading"], r["instant_accel"]) for r in rows2]

                matches = sum(
                    1 for (a, b) in zip(pattern, pattern2)
                    if abs(a[0] - b[0]) < 1 and abs(a[1] - b[1]) < 0.5
                )

                if matches >= 5:
                    clones.append((psn, psn2))
                    break

        return clones

    # ---------------------------------------------------------
    # THREAT RATING
    # ---------------------------------------------------------
    def _rate_threat_level(self, clones, position, behavior):
        total = len(clones) + len(position) + len(behavior)

        if total >= 10:
            return "Critical", 0.95
        elif total >= 5:
            return "High", 0.88
        elif total >= 2:
            return "Medium", 0.75
        else:
            return "Low", 0.60

    # ---------------------------------------------------------
    # REPORT GENERATION
    # ---------------------------------------------------------
    def _generate_indicators(self, cloned, position_conflicts, clones):
        indicators = []
        if cloned:
            indicators.append("Multiple vehicles share identical trajectories")
        if position_conflicts:
            indicators.append("Two PSNs occupy same position at same time")
        if clones:
            indicators.append("Vehicles show identical acceleration & speed patterns")

        return indicators

    def _compile_report(self, filepath):
        return {
            "attack_type": "Sybil Attack",
            "timestamp": datetime.now().isoformat(),
            "file": filepath,
            "threat_level": self.threat_level,
            "confidence_score": self.confidence_score,
            "findings": self.results,
        }
