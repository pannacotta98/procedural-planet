export default "#define GLSLIFY 1\nuniform float time;\nuniform float opacity;\nuniform float amount;\nuniform float warp;\nuniform float smoothness;\nuniform vec3 color;\n\nin vec3 outPosition;\nin vec3 outNormal;\n\n// psrdnoise (c) Stefan Gustavson and Ian McEwan,\n// ver. 2021-12-02, published under the MIT license:\n// https://github.com/stegu/psrdnoise/\n\nvec4 permute(vec4 i) {\n  vec4 im = mod(i, 289.0);\n  return mod(((im * 34.0) + 10.0) * im, 289.0);\n}\n\nfloat psrdnoise(vec3 x, vec3 period, float alpha, out vec3 gradient) {\n  const mat3 M = mat3(0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0);\n  const mat3 Mi = mat3(-0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5);\n  vec3 uvw = M * x;\n  vec3 i0 = floor(uvw), f0 = fract(uvw);\n  vec3 g_ = step(f0.xyx, f0.yzz), l_ = 1.0 - g_;\n  vec3 g = vec3(l_.z, g_.xy), l = vec3(l_.xy, g_.z);\n  vec3 o1 = min(g, l), o2 = max(g, l);\n  vec3 i1 = i0 + o1, i2 = i0 + o2, i3 = i0 + vec3(1.0);\n  vec3 v0 = Mi * i0, v1 = Mi * i1, v2 = Mi * i2, v3 = Mi * i3;\n  vec3 x0 = x - v0, x1 = x - v1, x2 = x - v2, x3 = x - v3;\n  if(any(greaterThan(period, vec3(0.0)))) {\n    vec4 vx = vec4(v0.x, v1.x, v2.x, v3.x);\n    vec4 vy = vec4(v0.y, v1.y, v2.y, v3.y);\n    vec4 vz = vec4(v0.z, v1.z, v2.z, v3.z);\n    if(period.x > 0.0)\n      vx = mod(vx, period.x);\n    if(period.y > 0.0)\n      vy = mod(vy, period.y);\n    if(period.z > 0.0)\n      vz = mod(vz, period.z);\n    i0 = floor(M * vec3(vx.x, vy.x, vz.x) + 0.5);\n    i1 = floor(M * vec3(vx.y, vy.y, vz.y) + 0.5);\n    i2 = floor(M * vec3(vx.z, vy.z, vz.z) + 0.5);\n    i3 = floor(M * vec3(vx.w, vy.w, vz.w) + 0.5);\n  }\n  vec4 hash = permute(permute(permute(vec4(i0.z, i1.z, i2.z, i3.z)) + vec4(i0.y, i1.y, i2.y, i3.y)) + vec4(i0.x, i1.x, i2.x, i3.x));\n  vec4 theta = hash * 3.883222077;\n  vec4 sz = hash * -0.006920415 + 0.996539792;\n  vec4 psi = hash * 0.108705628;\n  vec4 Ct = cos(theta), St = sin(theta);\n  vec4 sz_prime = sqrt(1.0 - sz * sz);\n  vec4 gx, gy, gz;\n  if(alpha != 0.0) {\n    vec4 px = Ct * sz_prime, py = St * sz_prime, pz = sz;\n    vec4 Sp = sin(psi), Cp = cos(psi), Ctp = St * Sp - Ct * Cp;\n    vec4 qx = mix(Ctp * St, Sp, sz), qy = mix(-Ctp * Ct, Cp, sz);\n    vec4 qz = -(py * Cp + px * Sp);\n    vec4 Sa = vec4(sin(alpha)), Ca = vec4(cos(alpha));\n    gx = Ca * px + Sa * qx;\n    gy = Ca * py + Sa * qy;\n    gz = Ca * pz + Sa * qz;\n  } else {\n    gx = Ct * sz_prime;\n    gy = St * sz_prime;\n    gz = sz;\n  }\n  vec3 g0 = vec3(gx.x, gy.x, gz.x), g1 = vec3(gx.y, gy.y, gz.y);\n  vec3 g2 = vec3(gx.z, gy.z, gz.z), g3 = vec3(gx.w, gy.w, gz.w);\n  vec4 w = 0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3));\n  w = max(w, 0.0);\n  vec4 w2 = w * w, w3 = w2 * w;\n  vec4 gdotx = vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3));\n  float n = dot(w3, gdotx);\n  vec4 dw = -6.0 * w2 * gdotx;\n  vec3 dn0 = w3.x * g0 + dw.x * x0;\n  vec3 dn1 = w3.y * g1 + dw.y * x1;\n  vec3 dn2 = w3.z * g2 + dw.z * x2;\n  vec3 dn3 = w3.w * g3 + dw.w * x3;\n  gradient = 39.5 * (dn0 + dn1 + dn2 + dn3);\n  return 39.5 * n;\n}\n\n#if NUM_DIR_LIGHTS > 0\nstruct DirectionalLight {\n  vec3 direction;\n  vec3 color;\n};\nuniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];\n#endif\n\nvec3 diffuse(vec3 normal) {\n  vec3 lightDir = directionalLights[0].direction;\n  vec3 lightColor = directionalLights[0].color;\n  vec3 norm = normalize(normal);\n  float diff = max(dot(norm, lightDir), 0.0);\n  return diff * lightColor;\n}\n\nvoid main() {\n  // https://stegu.github.io/psrdnoise/3d-tutorial/3d-psrdnoise-tutorial-04.html\n  vec3 v = 2.0 * vec3(outPosition);\n  vec3 period = vec3(0.0);\n  vec3 gradient;\n  vec3 gradientSum = vec3(0.0);\n  float alpha = 0.1 * time;\n  float amp = 1.0;\n  float scale = 0.7;\n  float noise = 0.0;\n\n  float maxOffset = 0.0;\n\n  for(float i = 0.0; i < 7.0; i++) {\n    noise += amp * psrdnoise(scale * v + warp * gradientSum, period, scale * alpha, gradient);\n    gradientSum += amp * gradient;\n    maxOffset += amp;\n    amp *= mix(0.9, 0.1, smoothness);\n    scale *= 2.0;\n  }\n\n  float offsetFromMax = 0.4;\n  float minEdge = mix(maxOffset - 0.001 - offsetFromMax, -maxOffset, amount);\n  float transition = smoothstep(minEdge, maxOffset - offsetFromMax, noise);\n\n  float a = opacity * transition;\n\n  gl_FragColor = vec4(color * diffuse(outNormal), a);\n}"