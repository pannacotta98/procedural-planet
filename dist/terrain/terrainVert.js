export default "#define GLSLIFY 1\nuniform float time;\nuniform vec2 resolution;\nuniform float heightOffsetScale;\nuniform float baseFreq;\nuniform int numOctaves;\nuniform bool useExponentiation;\n\nout vec3 outNormal;\nout float radialOffset;\nout vec3 localPos;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289_0(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_0(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_0(vec4 x) {\n  return mod289_0(((x * 34.0) + 10.0) * x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v) {\n  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min(g.xyz, l.zxy);\n  vec3 i2 = max(g.xyz, l.zxy);\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_0(i);\n  vec4 p = permute_0(permute_0(permute_0(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3 ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)\n\n  vec4 x = x_ * ns.x + ns.yyyy;\n  vec4 y = y_ * ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4(x.xy, y.xy);\n  vec4 b1 = vec4(x.zw, y.zw);\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0) * 2.0 + 1.0;\n  vec4 s1 = floor(b1) * 2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n  vec3 p0 = vec3(a0.xy, h.x);\n  vec3 p1 = vec3(a0.zw, h.y);\n  vec3 p2 = vec3(a1.xy, h.z);\n  vec3 p3 = vec3(a1.zw, h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n}\n\n//#version 120\n\n// Cellular noise (\"Worley noise\") in 3D in GLSL.\n// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.\n// This code is released under the conditions of the MIT license.\n// See LICENSE file for details.\n// https://github.com/stegu/webgl-noise\n\n// Modulo 289 without a division (only multiplications)\nvec3 mod289_1(vec3 x) {\n\treturn x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\n// Modulo 7 without a division\nvec3 mod7(vec3 x) {\n\treturn x - floor(x * (1.0 / 7.0)) * 7.0;\n}\n\n// Permutation polynomial: (34x^2 + 6x) mod 289\nvec3 permute_1(vec3 x) {\n\treturn mod289_1((34.0 * x + 10.0) * x);\n}\n\n// Cellular noise, returning F1 and F2 in a vec2.\n// 3x3x3 search region for good F2 everywhere, but a lot\n// slower than the 2x2x2 version.\n// The code below is a bit scary even to its author,\n// but it has at least half decent performance on a\n// modern GPU. In any case, it beats any software\n// implementation of Worley noise hands down.\n\nvec2 cellular(vec3 P) {\n#define K 0.142857142857 // 1/7\n#define Ko 0.428571428571 // 1/2-K/2\n#define K2 0.020408163265306 // 1/(7*7)\n#define Kz 0.166666666667 // 1/6\n#define Kzo 0.416666666667 // 1/2-1/6*2\n#define jitter 1.0 // smaller jitter gives more regular pattern\n\n\tvec3 Pi = mod289_1(floor(P));\n\tvec3 Pf = fract(P) - 0.5;\n\n\tvec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);\n\tvec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);\n\tvec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);\n\n\tvec3 p = permute_1(Pi.x + vec3(-1.0, 0.0, 1.0));\n\tvec3 p1 = permute_1(p + Pi.y - 1.0);\n\tvec3 p2 = permute_1(p + Pi.y);\n\tvec3 p3 = permute_1(p + Pi.y + 1.0);\n\n\tvec3 p11 = permute_1(p1 + Pi.z - 1.0);\n\tvec3 p12 = permute_1(p1 + Pi.z);\n\tvec3 p13 = permute_1(p1 + Pi.z + 1.0);\n\n\tvec3 p21 = permute_1(p2 + Pi.z - 1.0);\n\tvec3 p22 = permute_1(p2 + Pi.z);\n\tvec3 p23 = permute_1(p2 + Pi.z + 1.0);\n\n\tvec3 p31 = permute_1(p3 + Pi.z - 1.0);\n\tvec3 p32 = permute_1(p3 + Pi.z);\n\tvec3 p33 = permute_1(p3 + Pi.z + 1.0);\n\n\tvec3 ox11 = fract(p11 * K) - Ko;\n\tvec3 oy11 = mod7(floor(p11 * K)) * K - Ko;\n\tvec3 oz11 = floor(p11 * K2) * Kz - Kzo; // p11 < 289 guaranteed\n\n\tvec3 ox12 = fract(p12 * K) - Ko;\n\tvec3 oy12 = mod7(floor(p12 * K)) * K - Ko;\n\tvec3 oz12 = floor(p12 * K2) * Kz - Kzo;\n\n\tvec3 ox13 = fract(p13 * K) - Ko;\n\tvec3 oy13 = mod7(floor(p13 * K)) * K - Ko;\n\tvec3 oz13 = floor(p13 * K2) * Kz - Kzo;\n\n\tvec3 ox21 = fract(p21 * K) - Ko;\n\tvec3 oy21 = mod7(floor(p21 * K)) * K - Ko;\n\tvec3 oz21 = floor(p21 * K2) * Kz - Kzo;\n\n\tvec3 ox22 = fract(p22 * K) - Ko;\n\tvec3 oy22 = mod7(floor(p22 * K)) * K - Ko;\n\tvec3 oz22 = floor(p22 * K2) * Kz - Kzo;\n\n\tvec3 ox23 = fract(p23 * K) - Ko;\n\tvec3 oy23 = mod7(floor(p23 * K)) * K - Ko;\n\tvec3 oz23 = floor(p23 * K2) * Kz - Kzo;\n\n\tvec3 ox31 = fract(p31 * K) - Ko;\n\tvec3 oy31 = mod7(floor(p31 * K)) * K - Ko;\n\tvec3 oz31 = floor(p31 * K2) * Kz - Kzo;\n\n\tvec3 ox32 = fract(p32 * K) - Ko;\n\tvec3 oy32 = mod7(floor(p32 * K)) * K - Ko;\n\tvec3 oz32 = floor(p32 * K2) * Kz - Kzo;\n\n\tvec3 ox33 = fract(p33 * K) - Ko;\n\tvec3 oy33 = mod7(floor(p33 * K)) * K - Ko;\n\tvec3 oz33 = floor(p33 * K2) * Kz - Kzo;\n\n\tvec3 dx11 = Pfx + jitter * ox11;\n\tvec3 dy11 = Pfy.x + jitter * oy11;\n\tvec3 dz11 = Pfz.x + jitter * oz11;\n\n\tvec3 dx12 = Pfx + jitter * ox12;\n\tvec3 dy12 = Pfy.x + jitter * oy12;\n\tvec3 dz12 = Pfz.y + jitter * oz12;\n\n\tvec3 dx13 = Pfx + jitter * ox13;\n\tvec3 dy13 = Pfy.x + jitter * oy13;\n\tvec3 dz13 = Pfz.z + jitter * oz13;\n\n\tvec3 dx21 = Pfx + jitter * ox21;\n\tvec3 dy21 = Pfy.y + jitter * oy21;\n\tvec3 dz21 = Pfz.x + jitter * oz21;\n\n\tvec3 dx22 = Pfx + jitter * ox22;\n\tvec3 dy22 = Pfy.y + jitter * oy22;\n\tvec3 dz22 = Pfz.y + jitter * oz22;\n\n\tvec3 dx23 = Pfx + jitter * ox23;\n\tvec3 dy23 = Pfy.y + jitter * oy23;\n\tvec3 dz23 = Pfz.z + jitter * oz23;\n\n\tvec3 dx31 = Pfx + jitter * ox31;\n\tvec3 dy31 = Pfy.z + jitter * oy31;\n\tvec3 dz31 = Pfz.x + jitter * oz31;\n\n\tvec3 dx32 = Pfx + jitter * ox32;\n\tvec3 dy32 = Pfy.z + jitter * oy32;\n\tvec3 dz32 = Pfz.y + jitter * oz32;\n\n\tvec3 dx33 = Pfx + jitter * ox33;\n\tvec3 dy33 = Pfy.z + jitter * oy33;\n\tvec3 dz33 = Pfz.z + jitter * oz33;\n\n\tvec3 d11 = dx11 * dx11 + dy11 * dy11 + dz11 * dz11;\n\tvec3 d12 = dx12 * dx12 + dy12 * dy12 + dz12 * dz12;\n\tvec3 d13 = dx13 * dx13 + dy13 * dy13 + dz13 * dz13;\n\tvec3 d21 = dx21 * dx21 + dy21 * dy21 + dz21 * dz21;\n\tvec3 d22 = dx22 * dx22 + dy22 * dy22 + dz22 * dz22;\n\tvec3 d23 = dx23 * dx23 + dy23 * dy23 + dz23 * dz23;\n\tvec3 d31 = dx31 * dx31 + dy31 * dy31 + dz31 * dz31;\n\tvec3 d32 = dx32 * dx32 + dy32 * dy32 + dz32 * dz32;\n\tvec3 d33 = dx33 * dx33 + dy33 * dy33 + dz33 * dz33;\n\n\t// Sort out the two smallest distances (F1, F2)\n#if 0\n\t// Cheat and sort out only F1\n\tvec3 d1 = min(min(d11, d12), d13);\n\tvec3 d2 = min(min(d21, d22), d23);\n\tvec3 d3 = min(min(d31, d32), d33);\n\tvec3 d = min(min(d1, d2), d3);\n\td.x = min(min(d.x, d.y), d.z);\n\treturn vec2(sqrt(d.x)); // F1 duplicated, no F2 computed\n#else\n\t// Do it right and sort out both F1 and F2\n\tvec3 d1a = min(d11, d12);\n\td12 = max(d11, d12);\n\td11 = min(d1a, d13); // Smallest now not in d12 or d13\n\td13 = max(d1a, d13);\n\td12 = min(d12, d13); // 2nd smallest now not in d13\n\tvec3 d2a = min(d21, d22);\n\td22 = max(d21, d22);\n\td21 = min(d2a, d23); // Smallest now not in d22 or d23\n\td23 = max(d2a, d23);\n\td22 = min(d22, d23); // 2nd smallest now not in d23\n\tvec3 d3a = min(d31, d32);\n\td32 = max(d31, d32);\n\td31 = min(d3a, d33); // Smallest now not in d32 or d33\n\td33 = max(d3a, d33);\n\td32 = min(d32, d33); // 2nd smallest now not in d33\n\tvec3 da = min(d11, d21);\n\td21 = max(d11, d21);\n\td11 = min(da, d31); // Smallest now in d11\n\td31 = max(da, d31); // 2nd smallest now not in d31\n\td11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;\n\td11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest\n\td12 = min(d12, d21); // 2nd smallest now not in d21\n\td12 = min(d12, d22); // nor in d22\n\td12 = min(d12, d31); // nor in d31\n\td12 = min(d12, d32); // nor in d32\n\td11.yz = min(d11.yz, d12.xy); // nor in d12.yz\n\td11.y = min(d11.y, d12.z); // Only two more to go\n\td11.y = min(d11.y, d11.z); // Done! (Phew!)\n\treturn sqrt(d11.xy); // F1, F2\n#endif\n}\n\nfloat sampleHeight(vec3 pos) {\n  float heightOffset = 0.0;\n  float amp = 1.0;\n  float freq = baseFreq;\n  for(int i = 0; i < numOctaves; ++i) {\n    // heightOffset += amp * cellular(freq * pos).x;\n    heightOffset += amp * snoise(freq * pos);\n    // heightOffset += amp * (1.0 - abs(snoise(freq * pos)));\n    // heightOffset += amp * (abs(snoise(freq * pos)));\n    amp *= 0.5;\n    freq *= 2.0;\n  }\n  return heightOffsetScale * ((useExponentiation) ? exp(heightOffset) : heightOffset);\n}\n\nvoid main() {\n  radialOffset = sampleHeight(position);\n\n  // Sample height near the point to calculate gradient using\n  // the triangle method\n  float offsetLength = 0.001;\n  vec3 tangent1 = normalize(cross(normal, vec3(1.0, 0.0, 0.01)));\n  vec3 tangent2 = normalize(cross(tangent1, normal));\n  vec3 tangent3 = normalize(-(tangent1 + tangent2));\n  vec3 p1 = normalize(position + tangent1 * offsetLength);\n  vec3 p2 = normalize(position + tangent2 * offsetLength);\n  vec3 p3 = normalize(position + tangent3 * offsetLength);\n  vec3 s1 = (1.0 + sampleHeight(p1)) * p1;\n  vec3 s2 = (1.0 + sampleHeight(p2)) * p2;\n  vec3 s3 = (1.0 + sampleHeight(p3)) * p3;\n  vec3 v1 = s1 - s3;\n  vec3 v2 = s2 - s3;\n  outNormal = normalMatrix * normalize(-cross(v1, v2));\n\n  localPos = position;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + radialOffset * normal, 1.0);\n}"