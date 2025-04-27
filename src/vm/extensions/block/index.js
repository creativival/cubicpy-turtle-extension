import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import translations from './translations.json';
import blockIcon from './cubicpy_turtle_logo_40x40.png';

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
  const localeSetup = formatMessage.setup();
  if (localeSetup && localeSetup.translations[localeSetup.locale]) {
    Object.assign(
      localeSetup.translations[localeSetup.locale],
      translations[localeSetup.locale]
    );
  }
};

const EXTENSION_ID = 'cubicpyTurtle';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://creativival.github.io/cubicpy-turtle-extension/dist/cubicpyTurtle.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return formatMessage({
      id: 'cubicpyTurtle.name',
      default: 'CubicPy Turtle',
      description: 'name of the extension'
    });
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return EXTENSION_ID;
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * The extensionURL will be changed to the URL of the loading server.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  /**
   * Construct a set of blocks for cubicpyTurtle.
   * @param {Runtime} runtime - the Scratch 3.0 runtime.
   */
  constructor(runtime) {
    /**
     * The Scratch 3.0 runtime.
     * @type {Runtime}
     */
    this.runtime = runtime;
    this.roomName = '1000'
    this.bodyData = [];
    this.objectType = 'cube';
    this.sizeX = 1.0;
    this.sizeY = 1.0;
    this.sizeZ = 1.0;
    this.mass = 1.0;
    this.rotationH = 0;
    this.rotationP = 0;
    this.rotationR = 0;
    this.basePoint = 0;
    this.isRemovable = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityZ = 0;
    this.isAllowedFloat = 1  // default: 'float mode'
    // Turtle
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.polarTheta = 90;
    this.polarPhi = 0;
    this.drawable = true;
    this.color = [0, 0, 0, 1];
    this.shape = 'cube';

    this.socket = null;
    this.inactivityTimeout = null; // 非アクティブタイマー
    this.inactivityDelay = 2000; // 2秒後に接続を切断

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    setupTranslations();
    return {
      id: ExtensionBlocks.EXTENSION_ID,
      name: ExtensionBlocks.EXTENSION_NAME,
      extensionURL: ExtensionBlocks.extensionURL,
      blockIconURI: blockIcon,
      showStatusButton: false,
      blocks: [
        {
          opcode: 'setRoomName',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setRoomName',
            default: '(CT) Set room name to [ROOMNAME]',
            description: 'set room name'
          }),
          arguments: {
            ROOMNAME: {
              type: ArgumentType.STRING,
              defaultValue: '1000'
            }
          }
        },
        {
          opcode: 'setCubeScale',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeScale',
            default: '(CT) Set box size to [SIZE_X] [SIZE_Y] [SIZE_Z]',
            description: 'set box size'
          }),
          arguments: {
            SIZE_X: {
              type: ArgumentType.NUMBER,
              defaultValue: 1.0
            },
            SIZE_Y: {
              type: ArgumentType.NUMBER,
              defaultValue: 1.0
            },  
            SIZE_Z: {
              type: ArgumentType.NUMBER,
              defaultValue: 1.0
            }
          }
        },
        {
          opcode: 'setCubeMass',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeMass',
            default: '(CT) Set cube mass to [MASS]',
            description: 'set cube mass'
          }),
          arguments: {
            MASS: {
              type: ArgumentType.NUMBER,
              defaultValue: 1.0
            }
          }
        },
        {
          opcode: 'setCubeRotation',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeRotation',
            default: '(CT) Set cube h p r rotation to [H] [P] [R]',
            description: 'set cube rotation'
          }),
          arguments: {
            H: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            P: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            R: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'setCubeBasePoint',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeBasePoint',
            default: '(CT) Set cube base point to [BASE_POINT]',
            description: 'set cube base point'
          }),
          arguments: {
            BASE_POINT: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
          opcode: 'setCubeRemove',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeRemove',
            default: '(CT) Set cube removable to [REMOVE]',
            description: 'set cube remove'
          }),
          arguments: {
            REMOVE: {
              type: ArgumentType.STRING,
              defaultValue: 'off',
              menu: 'onOrOffMenu'
            }
          }
        },
        {
          opcode: 'setCubeVelocity',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.setCubeVelocity',
            default: '(CT) Set cube velocity to [VELOCITY_X] [VELOCITY_Y] [VELOCITY_Z]',
            description: 'set cube velocity'
          }),
          arguments: {
            VELOCITY_X: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            VELOCITY_Y: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            },
            VELOCITY_Z: {
              type: ArgumentType.NUMBER,
              defaultValue: 0
            }
          }
        },
        {
            opcode: 'setColor',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.setColor',
                default: '(CT) Set color r: [R] g: [G] b: [B] alpha: [ALPHA]',
                description: 'set color'
            }),
            arguments: {
                R: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                },
                G: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                B: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                ALPHA: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 1
                }
            }
        },
        {
            opcode: 'setShape',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.setShape',
                default: '(CT) Set shape to [SHAPE]',
                description: 'set shape'
            }),
            arguments: {
                SHAPE: {
                    type: ArgumentType.STRING,
                    defaultValue: 'cube',
                    menu: 'shapeMenu'
                }
            }
        },
        {
            opcode: 'forward',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.forward',
                default: '(CT) Move forward [LENGTH]',
                description: 'forward'
            }),
            arguments: {
                LENGTH: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '10'
                }
            }
        },
        {
            opcode: 'backward',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.backward',
                default: '(CT) Move backward [LENGTH]',
                description: 'backward'
            }),
            arguments: {
                LENGTH: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '10'
                }
            }
        },
        {
            opcode: 'up',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.up',
                default: '(CT) Head up [ANGLE]',
                description: 'up'
            }),
            arguments: {
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '90'
                }
            }
        },
        {
            opcode: 'down',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.down',
                default: '(CT) Head down [ANGLE]',
                description: 'down'
            }),
            arguments: {
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '90'
                }
            }
        },
        {
            opcode: 'right',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.right',
                default: '(CT) Turn right [ANGLE]',
                description: 'right'
            }),
            arguments: {
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '90'
                }
            }
        },
        {
            opcode: 'left',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.left',
                default: '(CT) Turn left [ANGLE]',
                description: 'left'
            }),
            arguments: {
                ANGLE: {
                    type: ArgumentType.NUMBER,
                    defaultValue: '90'
                }
            }
        },
        {
          opcode: 'setCommand',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpy.setCommand',
            default: 'Set command [COMMAND]',
            description: 'set command'
          }),
          arguments: {
            COMMAND: {
              type: ArgumentType.STRING,
              defaultValue: 'axis'
            }
          }
        },
        {
          opcode: 'setTopLeftText',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpy.setTopLeftText',
            default: 'Display top left text: [TEXT]',
            description: 'display game text'
          }),
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'Hello World',
            }
          }
        },
        {
          opcode: 'setBottomLeftText',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpy.setBottomLeftText',
            default: 'Display bottom left text: [TEXT]',
            description: 'display game text'
          }),
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: 'Hello World',
            }
          }
        }, 
        {
          opcode: 'sendData',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.sendData',
            default: '(CT) Send data',
            description: 'send data to server'
          }),
        },
        {
          opcode: 'clearData',
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: 'cubicpyTurtle.clearData',
            default: '(CT) Clear data',
            description: 'clear data'
          }),
        },
        {
            opcode: 'penDown',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.penDown',
                default: '(CT) Pen down',
                description: 'pen down'
            }),
        },
        {
            opcode: 'penUp',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.penUp',
                default: '(CT) Pen up',
                description: 'pen up'
            }),
        },
        {
            opcode: 'setPos',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.setPos',
                default: '(CT) Set position x: [X] y: [Y] z: [Z]',
                description: 'set position'
            }),
            arguments: {
                X: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Y: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                },
                Z: {
                    type: ArgumentType.NUMBER,
                    defaultValue: 0
                }
            }
        },
        {
            opcode: 'reset',
            blockType: BlockType.COMMAND,
            text: formatMessage({
                id: 'cubicpyTurtle.reset',
                default: '(CT) Reset turtle',
                description: 'reset'
            }),
        }
      ],
      menus: {
        onOrOffMenu: {
          acceptReporters: false,
          items: [
            {
              text: formatMessage({
                id: 'cubicpyTurtle.off',
                default: 'off',
                description: 'Menu item for off'
              }),
              value: 'off'
            },
            {
              text: formatMessage({
                id: 'cubicpyTurtle.on',
                default: 'on',
                description: 'Menu item for on'
              }),
              value: 'on'
            }
          ]
        },
        shapeMenu: {
          acceptReporters: false,
          items: [
            {
              text: formatMessage({
                id: 'cubicpyTurtle.cube',
                default: 'cube',
                description: 'Menu item for cube'
              }),
              value: 'cube'
            },
            {
              text: formatMessage({
                id: 'cubicpyTurtle.sphere',
                default: 'sphere',
                description: 'Menu item for sphere'
              }),
              value: 'sphere'
            },
            {
              text: formatMessage({
                id: 'cubicpyTurtle.cylinder',
                default: 'cylinder',
                description: 'Menu item for cylinder'
              }),
              value: 'cylinder'
            }
          ]
        }
      }
    };
  }

  setRoomName(args) {
    this.roomName = args.ROOMNAME;
  }

  clearData() {
    // this.roomName = '1000'; // 初期化しない（明示的に変更されるまで同じ値を使用する）
    this.bodyData = [];
    this.objectType = 'cube';
    this.sizeX = 1.0;
    this.sizeY = 1.0;
    this.sizeZ = 1.0;
    this.mass = 1.0;
    this.rotationH = 0;
    this.rotationP = 0;
    this.rotationR = 0;
    this.basePoint = 0;
    this.isRemovable = false;
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityZ = 0;
    this.isAllowedFloat = 1  // default: 'float mode'
    // Turtle
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.polarTheta = 90;
    this.polarPhi = 0;
    this.drawable = true;
    this.color = [0, 0, 0, 1];
  }

  setCubeScale(args) {
    this.sizeX = Number(args.SIZE_X);
    this.sizeY = Number(args.SIZE_Y);
    this.sizeZ = Number(args.SIZE_Z);
  }

  setCubeMass(args) {
    this.mass = Number(args.MASS);
  }

  setCubeRotation(args) {
    this.rotationH = Number(args.H);
    this.rotationP = Number(args.P);
    this.rotationR = Number(args.R);
  }

  setCubeBasePoint(args) {
    this.basePoint = Number(args.BASE_POINT);
  }

  setCubeRemove(args) {
    this.isRemovable = args.REMOVE;
    if (this.isRemovable === 'on') {
      this.isRemovable = true;
    } else {
      this.isRemovable = false;
    }
  }

  setCubeVelocity(args) {
    this.velocityX = Number(args.VELOCITY_X);
    this.velocityY = Number(args.VELOCITY_Y);
    this.velocityZ = Number(args.VELOCITY_Z);
  }

  addObject(position, objectType) {
    let x = position[0];
    let y = position[1];
    let z = position[2];
    let scaleX = this.sizeX;
    let scaleY = this.sizeY;
    let scaleZ = this.sizeZ;
    let red = this.color[0];
    let green = this.color[1];
    let blue = this.color[2];
    let alpha = this.color[3];
    let h = this.rotationH;
    let p = this.rotationP;
    let r = this.rotationR;
    let basePoint = this.basePoint;
    let isRemovable = this.isRemovable;
    let velocityX = this.velocityX;
    let velocityY = this.velocityY;
    let velocityZ = this.velocityZ;

    this.bodyData.push({
      type: objectType,
      pos: this.roundNumbers([x, y, z]),
      scale: [scaleX, scaleY, scaleZ],
      color: [red, green, blue],
      color_alpha: alpha,
      hpr: [h, p, r],
      basePoint: basePoint,
      remove: isRemovable,
      velocity: [velocityX, velocityY, velocityZ]
    });
  }

  forward(args) {
      const length = Number(args.LENGTH);
      let x = this.x + length * Math.sin(this.degToRad(this.polarTheta)) * Math.cos(this.degToRad(this.polarPhi));
      let y = this.y + length * Math.sin(this.degToRad(this.polarTheta)) * Math.sin(this.degToRad(this.polarPhi));
      let z = this.z + length * Math.cos(this.degToRad(this.polarTheta));
      [x, y, z] = this.roundNumbers([x, y, z]);

      if (this.drawable) {
          this.drawLine(this.x, this.y, this.z, x, y, z);
      }

      this.x = x;
      this.y = y;
      this.z = z;

  }

  backward(args) {
      const length = Number(args.LENGTH);
      this.forward({LENGTH: -length})
  }

  up(args) {
      const angle = Number(args.ANGLE);
      this.polarTheta -= angle;
  }

  down(args) {
      const angle = Number(args.ANGLE);
      this.polarTheta += angle;
  }

  right(args) {
      const angle = Number(args.ANGLE);
      this.polarPhi -= angle;
  }

  left(args) {
      const angle = Number(args.ANGLE);
      this.polarPhi += angle;
  }

  setColor(args) {
      const r = Number(args.R);
      const g = Number(args.G);
      const b = Number(args.B);
      const alpha = Number(args.ALPHA);
      this.color = [r, g, b, alpha];
  }

  penDown() {
      this.drawable = true;
  }

  penUp() {
      this.drawable = false;
  }

  setPos(args) {
      this.x = Number(args.X);
      this.y = Number(args.Y);
      this.z = Number(args.Z);
  }

  reset() {
      // Turtle
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.polarTheta = 90;
      this.polarPhi = 90;
      this.drawable = true;
  }

  drawLine(x1, y1, z1, x2, y2, z2) {
      x1 = Math.floor(x1);
      y1 = Math.floor(y1);
      z1 = Math.floor(z1);
      x2 = Math.floor(x2);
      y2 = Math.floor(y2);
      z2 = Math.floor(z2);
      const diff_x = x2 - x1;
      const diff_y = y2 - y1;
      const diff_z = z2 - z1;
      const maxLength = Math.max(Math.abs(diff_x), Math.abs(diff_y), Math.abs(diff_z));

      if (diff_x === 0 && diff_y === 0 && diff_z === 0) {
          return false;
      }

      if (Math.abs(diff_x) === maxLength) {
          if (x2 > x1) {
              for (let x = x1 + 1; x <= x2; x++) {
                  const y = y1 + (x - x1) * diff_y / diff_x;
                  const z = z1 + (x - x1) * diff_z / diff_x;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          } else{
              for (let x = x1 - 1; x >= x2; x--) {
                  const y = y1 + (x - x1) * diff_y / diff_x;
                  const z = z1 + (x - x1) * diff_z / diff_x;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          }
      } else if (Math.abs(diff_y) === maxLength) {
          if (y2 > y1) {
              for (let y = y1 + 1; y <= y2; y++) {
                  const x = x1 + (y - y1) * diff_x / diff_y;
                  const z = z1 + (y - y1) * diff_z / diff_y;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          } else {
              for (let y = y1 - 1; y >= y2; y--) {
                  const x = x1 + (y - y1) * diff_x / diff_y;
                  const z = z1 + (y - y1) * diff_z / diff_y;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          }
      } else if (Math.abs(diff_z) === maxLength) {
          if (z2 > z1) {
              for (let z = z1 + 1; z <= z2; z++) {
                  const x = x1 + (z - z1) * diff_x / diff_z;
                  const y = y1 + (z - z1) * diff_y / diff_z;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          } else {
              for (let z = z1 - 1; z >= z2; z--) {
                  const x = x1 + (z - z1) * diff_x / diff_z;
                  const y = y1 + (z - z1) * diff_y / diff_z;
                  console.log(x, y, z);
                  this.addObject([x, y, z], this.shape);
              }
          }
      }
  }

  // テキストを表示する
  setTopLeftText(args) {
    const text = args.TEXT;

    this.bodyData.push({
      type: 'top_left_text',
      text: text,
    });
  }

  setBottomLeftText(args) {
    const text = args.TEXT;

    this.bodyData.push({
      type: 'bottom_left_text',
      text: text,
    });
  }

  setCommand(args) {
    const command = args.COMMAND;

    this.bodyData.push({
      type: 'command',
      command: command,
    });
  }

  sendData() {
    console.log('Sending data...');
    const date = new Date();
    const dataToSend = {
      bodyData: this.bodyData,
      date: date.toISOString()
    };

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(dataToSend));
      console.log('Sent data to server (existing connection):', dataToSend);
      this.startInactivityTimer(); // タイマーを開始
    } else if (this.socket && this.socket.readyState === WebSocket.CONNECTING) {
      this.socket.onopen = () => {
        this.socket.send(this.roomName);
        console.log(`Joined room: ${this.roomName}`);
        this.socket.send(JSON.stringify(dataToSend));
        console.log('Sent data to server (connected):', dataToSend);
        this.startInactivityTimer(); // タイマーを開始
      };
    } else {
      this.socket = new WebSocket('wss://websocket.voxelamming.com');

      this.socket.onopen = () => {
        this.socket.send(this.roomName);
        console.log(`Joined room: ${this.roomName}`);
        this.socket.send(JSON.stringify(dataToSend));
        console.log('Sent data to server (new connection):', dataToSend);
        this.startInactivityTimer(); // タイマーを開始
      };

      this.socket.onerror = error => {
        console.error(`WebSocket error: ${error}`);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed.');
      };
    }
  }

  startInactivityTimer() {
    this.clearInactivityTimer(); // 既存のタイマーをクリア
    this.inactivityTimeout = setTimeout(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        console.log('No data sent for 2 seconds. Closing WebSocket connection.');
        this.socket.close();
      }
    }, this.inactivityDelay);
  }

  clearInactivityTimer() {
    if (this.inactivityTimeout) {
      clearTimeout(this.inactivityTimeout);
      this.inactivityTimeout = null;
    }
  }

  degToRad(degrees) {
      return degrees * (Math.PI / 180);
  }

  roundNumbers(num_list) {
    if (this.isAllowedFloat) {
      return num_list.map(val => parseFloat(val.toFixed(2)));
    } else {
      return num_list.map(val => Math.floor(parseFloat(val.toFixed(1))));
    }
  }

  roundTwoDecimals(num_list) {
    return num_list.map(val => parseFloat(val.toFixed(2)));
  }

  insertAt(arr, index, value) {
    // 配列が必要な長さに達していない場合、空の要素を追加
    while (arr.length <= index) {
      arr.push(""); // 必要に応じて空の文字列を追加
    }
    arr[index] = value; // 指定した位置に値を挿入
  }
}

export {
  ExtensionBlocks as default,
  ExtensionBlocks as blockClass
};
