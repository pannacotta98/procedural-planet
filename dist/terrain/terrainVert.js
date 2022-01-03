export default "#define GLSLIFY 1\nuniform float time;\nuniform vec2 resolution;\nuniform float heightOffsetScale;\nuniform float baseFreq;\nuniform float persistance;\nuniform float lacunarity;\nuniform float exponent;\nuniform bool absInvert;\nuniform int numOctaves;\n\nout vec3 outNormal;\nout float radialOffset;\nout vec3 localPos;\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex \n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20201014 (stegu)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n// \n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n  return mod289(((x * 34.0) + 10.0) * x);\n}\n\nvec4 taylorInvSqrt(vec4 r) {\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v) {\n  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);\n  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i = floor(v + dot(v, C.yyy));\n  vec3 x0 = v - i + dot(i, C.xxx);\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min(g.xyz, l.zxy);\n  vec3 i2 = max(g.xyz, l.zxy);\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3 ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)\n\n  vec4 x = x_ * ns.x + ns.yyyy;\n  vec4 y = y_ * ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4(x.xy, y.xy);\n  vec4 b1 = vec4(x.zw, y.zw);\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0) * 2.0 + 1.0;\n  vec4 s1 = floor(b1) * 2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;\n  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;\n\n  vec3 p0 = vec3(a0.xy, h.x);\n  vec3 p1 = vec3(a0.zw, h.y);\n  vec3 p2 = vec3(a1.xy, h.z);\n  vec3 p3 = vec3(a1.zw, h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);\n  m = m * m;\n  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));\n}\n\nfloat sampleHeight(vec3 pos) {\n  float heightOffset = 0.0;\n  float amp = 1.0;\n  float freq = baseFreq;\n  float normalizeFactor = 0.0;\n  for(int i = 0; i < numOctaves; ++i) {\n    if(absInvert) {\n      heightOffset += amp * (1.0 - abs(snoise(freq * pos)));\n    } else {\n      float noise = 0.5 + 0.5 * snoise(freq * pos);\n      heightOffset += amp * noise;\n    }\n    normalizeFactor += amp;\n    amp *= persistance;\n    freq *= lacunarity;\n  }\n  heightOffset /= normalizeFactor;\n  return heightOffsetScale * pow(heightOffset, exponent);\n}\n\nvoid main() {\n  radialOffset = sampleHeight(position);\n\n  // Sample height near the point to calculate gradient using\n  // the triangle method\n  float offsetLength = 0.001;\n  vec3 tangent1 = normalize(cross(normal, vec3(1.0, 0.0, 0.01)));\n  vec3 tangent2 = normalize(cross(tangent1, normal));\n  vec3 tangent3 = normalize(-(tangent1 + tangent2));\n  vec3 p1 = normalize(position + tangent1 * offsetLength);\n  vec3 p2 = normalize(position + tangent2 * offsetLength);\n  vec3 p3 = normalize(position + tangent3 * offsetLength);\n  vec3 s1 = (1.0 + sampleHeight(p1)) * p1;\n  vec3 s2 = (1.0 + sampleHeight(p2)) * p2;\n  vec3 s3 = (1.0 + sampleHeight(p3)) * p3;\n  vec3 v1 = s1 - s3;\n  vec3 v2 = s2 - s3;\n  outNormal = normalMatrix * normalize(-cross(v1, v2));\n\n  localPos = position;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + radialOffset * normal, 1.0);\n}"