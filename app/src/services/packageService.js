import { packages } from "../data/package";

function normalizePackage(pkg) {
  return {
    ...pkg,
    id: pkg._id ?? pkg.id,
    name: pkg.name ?? "Untitled Package",
    location: pkg.location ?? pkg.destination ?? "Unknown location",
    category: pkg.category ?? "General",
    ratings: Array.isArray(pkg.ratings) ? pkg.ratings : [],
  };
}

export async function getPackages() {
  return packages.map(normalizePackage);
}

export async function getPackageById(packageId) {
  const pkg = packages.find((p) => String(p.id) === String(packageId));

  if (!pkg) {
    throw new Error("Package not found");
  }

  return normalizePackage(pkg);
}
