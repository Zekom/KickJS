define(["./MeshRenderer", "kick/material/Material", "kick/core/Constants"],
    function (MeshRenderer, Material, Constants) {
        "use strict";

        /**
         * Result of Camera.pickPoint.
         *
         * @param {KICK.scene.GameObject} gameObject
         * @param {Integer} x
         * @param {Integer} y
         * @constructor
         */
        return function (engine, pickingRenderTarget, gameObject, x, y, setupCamera, engineUniforms) {
            var normal,
                uv,
                /**
                 * @private
                 * @method renderObjectWithShader
                 * @param {KICK.material.Shader} shader
                 * @return KICK.math.vec4
                 */
                renderObjectWithShader = function (shader) {
                    var array = new Uint8Array(4),
                        meshRenderers = gameObject.getComponentsOfType(MeshRenderer), // todo - create getComponentsWithMethod
                        i,
                        material = new Material(engine, {
                            name: "PickResult",
                            shader: shader
                        });
                    setupCamera();
                    pickingRenderTarget.bind();
                    engine.gl.clear(Constants.GL_COLOR_BUFFER_BIT | Constants.GL_DEPTH_BUFFER_BIT);
                    for (i = 0; i < meshRenderers.length; i++) {
                        meshRenderers[i].render(engineUniforms, material);
                    }

                    engine.gl.readPixels(x, y, 1, 1, Constants.GL_RGBA, Constants.GL_UNSIGNED_BYTE, array);
                    return array;
                },
                readNormal = function () {
                    var shader = engine.project.load(engine.project.ENGINE_SHADER___PICK_NORMAL);
                    normal = renderObjectWithShader(shader);
                    normal = [normal[0] / 255, normal[1] / 255, normal[2] / 255];
                },
                readUV = function () {
                    var shader = engine.project.load(engine.project.ENGINE_SHADER___PICK_UV);
                    uv = renderObjectWithShader(shader);
                    uv = [uv[0] / 255, uv[1] / 255];
                };


            Object.defineProperties(this, {
                /**
                 * Reference to the found gameObject
                 * @property gameObject
                 * @type kick.scene.GameObject
                 */
                gameObject: {
                    value: gameObject
                },
                /**
                 * The x value of the pick
                 * @property x
                 * @type Number
                 */
                x: {
                    value: x
                },
                /**
                 * The y value of the pick
                 * @property y
                 * @type Number
                 */
                y: {
                    value: y
                },
                /**
                 * The normal (in object coordinates) at the pick point
                 * @property normal
                 * @type KICK.math.vec3
                 */
                normal: {
                    get: function () {
                        if (!normal) {
                            readNormal();
                        }
                        return normal;
                    }
                },
                /**
                 * The uv of the pick point
                 * @property uv
                 * @type KICK.math.vec2
                 */
                uv: {
                    get: function () {
                        if (!uv) {
                            readUV();
                        }
                        return uv;
                    }
                }
            });
        };




    });