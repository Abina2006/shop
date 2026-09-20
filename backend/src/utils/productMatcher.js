/**
 * Deterministic Product Identity & Variant Matcher
 *
 * Exact 6-Factor Weighted Matching Score:
 * - Brand: 20%
 * - Model: 30%
 * - Product Name: 15%
 * - Variant: 15% (Storage, RAM, Color, Size, Pack Quantity)
 * - Specifications: 10%
 * - Identifiers: 10% (SKU, GTIN, EAN, UPC, ASIN, FSN, External Product ID)
 *
 * Thresholds:
 * - 90–100 → VERIFIED
 * - 70–89  → POSSIBLE_MATCH
 * - Below 70 → NOT_MATCHED
 */

export function parseSpecs(str = '') {
  const text = str.toLowerCase();

  // Storage: e.g. 32gb, 64gb, 128gb, 256gb, 512gb, 1tb, 2tb
  const storageMatch = text.match(/\b(32|64|128|256|512)\s*(gb|tb)\b|\b(1|2)\s*tb\b/i);
  const storage = storageMatch ? storageMatch[0].replace(/\s+/g, '').toLowerCase() : null;

  // RAM: e.g. 4gb, 6gb, 8gb, 12gb, 16gb, 32gb
  const ramMatch = text.match(/\b(4|6|8|12|16|32|64)\s*gb\s*(ram)?\b/i);
  const ram = ramMatch ? ramMatch[0].replace(/\s+/g, '').replace('ram', '').toLowerCase() : null;

  // Size: e.g. 40mm, 44mm, 45mm, 15.6 inch, 6.7 inch, 13-inch
  const sizeMatch = text.match(/\b(\d+(\.\d+)?)\s*(mm|inch|"|cm)\b/i);
  const size = sizeMatch ? sizeMatch[0].replace(/\s+/g, '').toLowerCase() : null;

  // Pack quantity (e.g. pack of 2, 4-pack, 3 pcs)
  const packMatch = text.match(/\b(pack\s*of\s*\d+|\d+\s*pack|\d+\s*(pcs|pieces))\b/i);
  const packQty = packMatch ? packMatch[0].replace(/\s+/g, '').toLowerCase() : null;

  // Color keywords
  const colors = [
    'black', 'white', 'blue', 'red', 'green', 'gold', 'silver', 
    'grey', 'gray', 'purple', 'pink', 'yellow', 'titanium', 'natural', 
    'midnight', 'starlight', 'space gray', 'phantom'
  ];
  const color = colors.find(c => text.includes(c)) || null;

  // Model numbers & series extraction
  // e.g. iPhone 15, iPhone 15 Pro, iPhone 15 Pro Max, Galaxy S24, S24 Ultra, WH-1000XM5, M3 Air, M2 Pro
  const modelMatch = text.match(/\b(iphone\s*(1[1-6]|x[r|s]?)\s*(pro\s*max|pro|plus)?|galaxy\s*s[2][0-4]\s*(ultra|plus|\+)?|wh-?1000xm[3-5]|macbook\s*(air|pro)?\s*(m[1-4])?|airdopes\s*\d+|watch\s*\d+|rog\s*\d+|pavilion)\b/i);
  const modelKey = modelMatch ? modelMatch[0].replace(/\s+/g, ' ').trim().toLowerCase() : null;

  return { storage, ram, size, color, packQty, modelKey, raw: text };
}

/**
 * Match two products or listings and return deterministic score and match status.
 */
export function matchProducts(prodA, prodB) {
  if (!prodA || !prodB) {
    return {
      matchScore: 0,
      matchStatus: 'NOT_MATCHED',
      matchConfidence: 'NO_MATCH',
      isVariantMatch: false,
      reason: 'Missing product details for comparison.',
      breakdown: { brand: 0, model: 0, name: 0, variant: 0, specs: 0, identifiers: 0 }
    };
  }

  const nameA = (prodA.name || prodA.title || '').trim();
  const nameB = (prodB.name || prodB.title || '').trim();
  const brandA = (prodA.brand || '').toLowerCase().trim();
  const brandB = (prodB.brand || '').toLowerCase().trim();

  const idA = prodA.asin || prodA.sku || prodA.fsn || prodA.externalProductId || prodA.id;
  const idB = prodB.asin || prodB.sku || prodB.fsn || prodB.externalProductId || prodB.id;

  // 1. Identifiers Match (10%)
  let identifierScore = 0;
  if (idA && idB && String(idA).trim().toLowerCase() === String(idB).trim().toLowerCase()) {
    identifierScore = 10;
  } else if (prodA.asin && prodB.asin && prodA.asin.toUpperCase() !== prodB.asin.toUpperCase()) {
    // Explicit ASIN mismatch
    return {
      matchScore: 0,
      matchStatus: 'NOT_MATCHED',
      matchConfidence: 'NO_MATCH',
      isVariantMatch: false,
      reason: `Marketplace identifier mismatch (${prodA.asin} vs ${prodB.asin}).`,
      breakdown: { brand: 0, model: 0, name: 0, variant: 0, specs: 0, identifiers: 0 }
    };
  }

  // 2. Brand Match (20%)
  let brandScore = 0;
  if (brandA && brandB && brandA !== 'unknown' && brandB !== 'unknown') {
    if (brandA === brandB || nameA.toLowerCase().includes(brandB) || nameB.toLowerCase().includes(brandA)) {
      brandScore = 20;
    } else {
      return {
        matchScore: 0,
        matchStatus: 'NOT_MATCHED',
        matchConfidence: 'NO_MATCH',
        isVariantMatch: false,
        reason: `Brand mismatch ("${prodA.brand}" vs "${prodB.brand}").`,
        breakdown: { brand: 0, model: 0, name: 0, variant: 0, specs: 0, identifiers: 0 }
      };
    }
  } else {
    // Attempt brand deduction from title
    const firstWordA = nameA.split(' ')[0]?.toLowerCase();
    const firstWordB = nameB.split(' ')[0]?.toLowerCase();
    if (firstWordA && firstWordA === firstWordB) {
      brandScore = 18;
    } else {
      brandScore = 12; // Neutral fallback when brand is unassigned
    }
  }

  // Parse specifications & variants
  const specsA = parseSpecs(`${nameA} ${prodA.variant || ''} ${prodA.model || ''} ${prodA.description || ''}`);
  const specsB = parseSpecs(`${nameB} ${prodB.variant || ''} ${prodB.model || ''} ${prodB.description || ''}`);

  // 3. Variant Match (15%) — Hard rejection on critical hardware/storage/RAM mismatches
  const variantMismatches = [];
  if (specsA.storage && specsB.storage && specsA.storage !== specsB.storage) {
    variantMismatches.push(`Storage (${specsA.storage} vs ${specsB.storage})`);
  }
  if (specsA.ram && specsB.ram && specsA.ram !== specsB.ram) {
    variantMismatches.push(`RAM (${specsA.ram} vs ${specsB.ram})`);
  }
  if (specsA.size && specsB.size && specsA.size !== specsB.size) {
    variantMismatches.push(`Size (${specsA.size} vs ${specsB.size})`);
  }
  if (specsA.packQty && specsB.packQty && specsA.packQty !== specsB.packQty) {
    variantMismatches.push(`Pack Quantity (${specsA.packQty} vs ${specsB.packQty})`);
  }

  // Critical variant conflict fails match immediately
  if (variantMismatches.length > 0) {
    return {
      matchScore: 40,
      matchStatus: 'NOT_MATCHED',
      matchConfidence: 'NO_MATCH',
      isVariantMatch: false,
      reason: `Critical variant mismatch: ${variantMismatches.join(', ')}.`,
      breakdown: { brand: brandScore, model: 0, name: 0, variant: 0, specs: 0, identifiers: identifierScore }
    };
  }

  let variantScore = 15;
  // If colors differ, slight deduct but still compatible variant
  if (specsA.color && specsB.color && specsA.color !== specsB.color) {
    variantScore = 10;
  }

  // 4. Model Match (30%)
  let modelScore = 0;
  if (specsA.modelKey && specsB.modelKey) {
    if (specsA.modelKey === specsB.modelKey) {
      modelScore = 30;
    } else {
      // Model mismatch (e.g. S24 vs S24 Ultra, iPhone 15 vs iPhone 15 Pro)
      return {
        matchScore: 45,
        matchStatus: 'NOT_MATCHED',
        matchConfidence: 'NO_MATCH',
        isVariantMatch: false,
        reason: `Model mismatch (${specsA.modelKey} vs ${specsB.modelKey}).`,
        breakdown: { brand: brandScore, model: 0, name: 0, variant: variantScore, specs: 0, identifiers: identifierScore }
      };
    }
  } else {
    // Model token overlap
    const modelA = (prodA.model || '').toLowerCase().trim();
    const modelB = (prodB.model || '').toLowerCase().trim();
    if (modelA && modelB && modelA === modelB) {
      modelScore = 30;
    } else {
      // Fallback: estimate from title token intersection
      const wordsA = new Set(nameA.toLowerCase().split(/\s+/).filter(w => w.length > 2));
      const wordsB = new Set(nameB.toLowerCase().split(/\s+/).filter(w => w.length > 2));
      const common = [...wordsA].filter(w => wordsB.has(w));
      const ratio = common.length / Math.max(wordsA.size, wordsB.size || 1);
      modelScore = Math.round(ratio * 30);
    }
  }

  // 5. Product Name Similarity (15%)
  const cleanTokensA = new Set(nameA.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1));
  const cleanTokensB = new Set(nameB.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1));
  const sharedTokens = [...cleanTokensA].filter(t => cleanTokensB.has(t));
  const nameRatio = sharedTokens.length / Math.max(cleanTokensA.size, cleanTokensB.size || 1);
  const nameScore = Math.round(nameRatio * 15);

  // 6. Specifications Match (10%)
  let specScore = 10;
  if (!specsA.storage && !specsA.ram && !specsA.size) {
    specScore = 8; // neutral when unstated
  }

  // Identifiers score default if verified match found or same product family
  if (identifierScore === 0 && modelScore >= 25 && brandScore >= 18) {
    identifierScore = 8;
  }

  const totalScore = Math.min(100, brandScore + modelScore + nameScore + variantScore + specScore + identifierScore);

  let matchStatus = 'NOT_MATCHED';
  let matchConfidence = 'NO_MATCH';

  if (totalScore >= 90) {
    matchStatus = 'VERIFIED';
    matchConfidence = 'EXACT_MATCH';
  } else if (totalScore >= 70) {
    matchStatus = 'POSSIBLE_MATCH';
    matchConfidence = 'HIGH_CONFIDENCE';
  }

  const reason = matchStatus === 'VERIFIED'
    ? 'Verified product identity with matching brand, model, and specifications.'
    : matchStatus === 'POSSIBLE_MATCH'
    ? 'High similarity match with compatible specifications.'
    : 'Similarity score is below verification threshold (<70%).';

  return {
    matchScore: totalScore,
    matchStatus,
    matchConfidence,
    isVariantMatch: matchStatus !== 'NOT_MATCHED',
    reason,
    breakdown: {
      brand: brandScore,
      model: modelScore,
      name: nameScore,
      variant: variantScore,
      specs: specScore,
      identifiers: identifierScore
    }
  };
}

export default matchProducts;
