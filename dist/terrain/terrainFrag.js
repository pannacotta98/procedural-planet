export default "#define GLSLIFY 1\nuniform float time;\nuniform vec2 resolution;\n\nin vec3 outNormal;\nin vec3 fragPos;\nin float radialOffset;\n\nvec3 objColor = vec3(0.57, 0.76, 0.23);\nvec3 snowColor = vec3(1.0, 1.0, 1.0);\nfloat ambientFactor = 0.0;\n\n#if NUM_DIR_LIGHTS > 0\nstruct DirectionalLight {\n  vec3 direction;\n  vec3 color;\n};\nuniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];\n#endif\n\nvec3 ambient() {\n  vec3 lightColor = directionalLights[0].color;\n  return ambientFactor * lightColor;\n}\n\nvec3 diffuse(vec3 normal) {\n  vec3 lightDir = directionalLights[0].direction;\n  vec3 lightColor = directionalLights[0].color;\n  vec3 norm = normalize(normal);\n  float diff = max(dot(norm, lightDir), 0.0);\n  return diff * lightColor;\n}\n\nvec3 terrainTexture() {\n  if(radialOffset > 0.065)\n    return snowColor;\n  else if(radialOffset > 0.035)\n    return objColor;\n  else\n    return vec3(0.1, 0.1, 0.9);\n}\n\nvoid main() {\n  vec3 result = (ambient() + diffuse(outNormal)) * terrainTexture();\n  gl_FragColor = vec4(result, 1.0);\n  // gl_FragColor = vec4(terrainTexture(), 1.0);\n  // gl_FragColor = vec4(0.5 * outNormal + 0.5, 1.0);\n}"