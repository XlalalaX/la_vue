/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const pb_msg = $root.pb_msg = (() => {

    /**
     * Namespace pb_msg.
     * @exports pb_msg
     * @namespace
     */
    const pb_msg = {};

    pb_msg.Msg = (function() {

        /**
         * Properties of a Msg.
         * @memberof pb_msg
         * @interface IMsg
         * @property {string|null} [sendID] Msg sendID
         * @property {string|null} [recvID] Msg recvID
         * @property {string|null} [groupID] Msg groupID
         * @property {number|null} [senderPlatformID] Msg senderPlatformID
         * @property {string|null} [senderNickname] Msg senderNickname
         * @property {string|null} [senderFaceURL] Msg senderFaceURL
         * @property {number|null} [sessionType] Msg sessionType
         * @property {number|null} [contentType] Msg contentType
         * @property {string|null} [content] Msg content
         * @property {number|Long|null} [sendTime] Msg sendTime
         * @property {number|null} [status] Msg status
         * @property {Uint8Array|null} [file] Msg file
         * @property {string|null} [fileName] Msg fileName
         * @property {number|null} [fileSize] Msg fileSize
         * @property {string|null} [selfID] Msg selfID
         */

        /**
         * Constructs a new Msg.
         * @memberof pb_msg
         * @classdesc Represents a Msg.
         * @implements IMsg
         * @constructor
         * @param {pb_msg.IMsg=} [properties] Properties to set
         */
        function Msg(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Msg sendID.
         * @member {string} sendID
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.sendID = "";

        /**
         * Msg recvID.
         * @member {string} recvID
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.recvID = "";

        /**
         * Msg groupID.
         * @member {string} groupID
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.groupID = "";

        /**
         * Msg senderPlatformID.
         * @member {number} senderPlatformID
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.senderPlatformID = 0;

        /**
         * Msg senderNickname.
         * @member {string} senderNickname
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.senderNickname = "";

        /**
         * Msg senderFaceURL.
         * @member {string} senderFaceURL
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.senderFaceURL = "";

        /**
         * Msg sessionType.
         * @member {number} sessionType
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.sessionType = 0;

        /**
         * Msg contentType.
         * @member {number} contentType
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.contentType = 0;

        /**
         * Msg content.
         * @member {string} content
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.content = "";

        /**
         * Msg sendTime.
         * @member {number|Long} sendTime
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.sendTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * Msg status.
         * @member {number} status
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.status = 0;

        /**
         * Msg file.
         * @member {Uint8Array} file
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.file = $util.newBuffer([]);

        /**
         * Msg fileName.
         * @member {string} fileName
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.fileName = "";

        /**
         * Msg fileSize.
         * @member {number} fileSize
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.fileSize = 0;

        /**
         * Msg selfID.
         * @member {string} selfID
         * @memberof pb_msg.Msg
         * @instance
         */
        Msg.prototype.selfID = "";

        /**
         * Creates a new Msg instance using the specified properties.
         * @function create
         * @memberof pb_msg.Msg
         * @static
         * @param {pb_msg.IMsg=} [properties] Properties to set
         * @returns {pb_msg.Msg} Msg instance
         */
        Msg.create = function create(properties) {
            return new Msg(properties);
        };

        /**
         * Encodes the specified Msg message. Does not implicitly {@link pb_msg.Msg.verify|verify} messages.
         * @function encode
         * @memberof pb_msg.Msg
         * @static
         * @param {pb_msg.IMsg} message Msg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Msg.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sendID != null && Object.hasOwnProperty.call(message, "sendID"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.sendID);
            if (message.recvID != null && Object.hasOwnProperty.call(message, "recvID"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.recvID);
            if (message.groupID != null && Object.hasOwnProperty.call(message, "groupID"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.groupID);
            if (message.senderPlatformID != null && Object.hasOwnProperty.call(message, "senderPlatformID"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.senderPlatformID);
            if (message.senderNickname != null && Object.hasOwnProperty.call(message, "senderNickname"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.senderNickname);
            if (message.senderFaceURL != null && Object.hasOwnProperty.call(message, "senderFaceURL"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.senderFaceURL);
            if (message.sessionType != null && Object.hasOwnProperty.call(message, "sessionType"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.sessionType);
            if (message.contentType != null && Object.hasOwnProperty.call(message, "contentType"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.contentType);
            if (message.content != null && Object.hasOwnProperty.call(message, "content"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.content);
            if (message.sendTime != null && Object.hasOwnProperty.call(message, "sendTime"))
                writer.uint32(/* id 10, wireType 0 =*/80).int64(message.sendTime);
            if (message.status != null && Object.hasOwnProperty.call(message, "status"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.status);
            if (message.file != null && Object.hasOwnProperty.call(message, "file"))
                writer.uint32(/* id 12, wireType 2 =*/98).bytes(message.file);
            if (message.fileName != null && Object.hasOwnProperty.call(message, "fileName"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.fileName);
            if (message.fileSize != null && Object.hasOwnProperty.call(message, "fileSize"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.fileSize);
            if (message.selfID != null && Object.hasOwnProperty.call(message, "selfID"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.selfID);
            return writer;
        };

        /**
         * Encodes the specified Msg message, length delimited. Does not implicitly {@link pb_msg.Msg.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb_msg.Msg
         * @static
         * @param {pb_msg.IMsg} message Msg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Msg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Msg message from the specified reader or buffer.
         * @function decode
         * @memberof pb_msg.Msg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb_msg.Msg} Msg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Msg.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb_msg.Msg();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.sendID = reader.string();
                        break;
                    }
                case 2: {
                        message.recvID = reader.string();
                        break;
                    }
                case 3: {
                        message.groupID = reader.string();
                        break;
                    }
                case 4: {
                        message.senderPlatformID = reader.int32();
                        break;
                    }
                case 5: {
                        message.senderNickname = reader.string();
                        break;
                    }
                case 6: {
                        message.senderFaceURL = reader.string();
                        break;
                    }
                case 7: {
                        message.sessionType = reader.int32();
                        break;
                    }
                case 8: {
                        message.contentType = reader.int32();
                        break;
                    }
                case 9: {
                        message.content = reader.string();
                        break;
                    }
                case 10: {
                        message.sendTime = reader.int64();
                        break;
                    }
                case 11: {
                        message.status = reader.int32();
                        break;
                    }
                case 12: {
                        message.file = reader.bytes();
                        break;
                    }
                case 13: {
                        message.fileName = reader.string();
                        break;
                    }
                case 14: {
                        message.fileSize = reader.int32();
                        break;
                    }
                case 15: {
                        message.selfID = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Msg message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb_msg.Msg
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb_msg.Msg} Msg
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Msg.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Msg message.
         * @function verify
         * @memberof pb_msg.Msg
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Msg.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.sendID != null && message.hasOwnProperty("sendID"))
                if (!$util.isString(message.sendID))
                    return "sendID: string expected";
            if (message.recvID != null && message.hasOwnProperty("recvID"))
                if (!$util.isString(message.recvID))
                    return "recvID: string expected";
            if (message.groupID != null && message.hasOwnProperty("groupID"))
                if (!$util.isString(message.groupID))
                    return "groupID: string expected";
            if (message.senderPlatformID != null && message.hasOwnProperty("senderPlatformID"))
                if (!$util.isInteger(message.senderPlatformID))
                    return "senderPlatformID: integer expected";
            if (message.senderNickname != null && message.hasOwnProperty("senderNickname"))
                if (!$util.isString(message.senderNickname))
                    return "senderNickname: string expected";
            if (message.senderFaceURL != null && message.hasOwnProperty("senderFaceURL"))
                if (!$util.isString(message.senderFaceURL))
                    return "senderFaceURL: string expected";
            if (message.sessionType != null && message.hasOwnProperty("sessionType"))
                if (!$util.isInteger(message.sessionType))
                    return "sessionType: integer expected";
            if (message.contentType != null && message.hasOwnProperty("contentType"))
                if (!$util.isInteger(message.contentType))
                    return "contentType: integer expected";
            if (message.content != null && message.hasOwnProperty("content"))
                if (!$util.isString(message.content))
                    return "content: string expected";
            if (message.sendTime != null && message.hasOwnProperty("sendTime"))
                if (!$util.isInteger(message.sendTime) && !(message.sendTime && $util.isInteger(message.sendTime.low) && $util.isInteger(message.sendTime.high)))
                    return "sendTime: integer|Long expected";
            if (message.status != null && message.hasOwnProperty("status"))
                if (!$util.isInteger(message.status))
                    return "status: integer expected";
            if (message.file != null && message.hasOwnProperty("file"))
                if (!(message.file && typeof message.file.length === "number" || $util.isString(message.file)))
                    return "file: buffer expected";
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                if (!$util.isString(message.fileName))
                    return "fileName: string expected";
            if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                if (!$util.isInteger(message.fileSize))
                    return "fileSize: integer expected";
            if (message.selfID != null && message.hasOwnProperty("selfID"))
                if (!$util.isString(message.selfID))
                    return "selfID: string expected";
            return null;
        };

        /**
         * Creates a Msg message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb_msg.Msg
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb_msg.Msg} Msg
         */
        Msg.fromObject = function fromObject(object) {
            if (object instanceof $root.pb_msg.Msg)
                return object;
            let message = new $root.pb_msg.Msg();
            if (object.sendID != null)
                message.sendID = String(object.sendID);
            if (object.recvID != null)
                message.recvID = String(object.recvID);
            if (object.groupID != null)
                message.groupID = String(object.groupID);
            if (object.senderPlatformID != null)
                message.senderPlatformID = object.senderPlatformID | 0;
            if (object.senderNickname != null)
                message.senderNickname = String(object.senderNickname);
            if (object.senderFaceURL != null)
                message.senderFaceURL = String(object.senderFaceURL);
            if (object.sessionType != null)
                message.sessionType = object.sessionType | 0;
            if (object.contentType != null)
                message.contentType = object.contentType | 0;
            if (object.content != null)
                message.content = String(object.content);
            if (object.sendTime != null)
                if ($util.Long)
                    (message.sendTime = $util.Long.fromValue(object.sendTime)).unsigned = false;
                else if (typeof object.sendTime === "string")
                    message.sendTime = parseInt(object.sendTime, 10);
                else if (typeof object.sendTime === "number")
                    message.sendTime = object.sendTime;
                else if (typeof object.sendTime === "object")
                    message.sendTime = new $util.LongBits(object.sendTime.low >>> 0, object.sendTime.high >>> 0).toNumber();
            if (object.status != null)
                message.status = object.status | 0;
            if (object.file != null)
                if (typeof object.file === "string")
                    $util.base64.decode(object.file, message.file = $util.newBuffer($util.base64.length(object.file)), 0);
                else if (object.file.length >= 0)
                    message.file = object.file;
            if (object.fileName != null)
                message.fileName = String(object.fileName);
            if (object.fileSize != null)
                message.fileSize = object.fileSize | 0;
            if (object.selfID != null)
                message.selfID = String(object.selfID);
            return message;
        };

        /**
         * Creates a plain object from a Msg message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb_msg.Msg
         * @static
         * @param {pb_msg.Msg} message Msg
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Msg.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.sendID = "";
                object.recvID = "";
                object.groupID = "";
                object.senderPlatformID = 0;
                object.senderNickname = "";
                object.senderFaceURL = "";
                object.sessionType = 0;
                object.contentType = 0;
                object.content = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.sendTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.sendTime = options.longs === String ? "0" : 0;
                object.status = 0;
                if (options.bytes === String)
                    object.file = "";
                else {
                    object.file = [];
                    if (options.bytes !== Array)
                        object.file = $util.newBuffer(object.file);
                }
                object.fileName = "";
                object.fileSize = 0;
                object.selfID = "";
            }
            if (message.sendID != null && message.hasOwnProperty("sendID"))
                object.sendID = message.sendID;
            if (message.recvID != null && message.hasOwnProperty("recvID"))
                object.recvID = message.recvID;
            if (message.groupID != null && message.hasOwnProperty("groupID"))
                object.groupID = message.groupID;
            if (message.senderPlatformID != null && message.hasOwnProperty("senderPlatformID"))
                object.senderPlatformID = message.senderPlatformID;
            if (message.senderNickname != null && message.hasOwnProperty("senderNickname"))
                object.senderNickname = message.senderNickname;
            if (message.senderFaceURL != null && message.hasOwnProperty("senderFaceURL"))
                object.senderFaceURL = message.senderFaceURL;
            if (message.sessionType != null && message.hasOwnProperty("sessionType"))
                object.sessionType = message.sessionType;
            if (message.contentType != null && message.hasOwnProperty("contentType"))
                object.contentType = message.contentType;
            if (message.content != null && message.hasOwnProperty("content"))
                object.content = message.content;
            if (message.sendTime != null && message.hasOwnProperty("sendTime"))
                if (typeof message.sendTime === "number")
                    object.sendTime = options.longs === String ? String(message.sendTime) : message.sendTime;
                else
                    object.sendTime = options.longs === String ? $util.Long.prototype.toString.call(message.sendTime) : options.longs === Number ? new $util.LongBits(message.sendTime.low >>> 0, message.sendTime.high >>> 0).toNumber() : message.sendTime;
            if (message.status != null && message.hasOwnProperty("status"))
                object.status = message.status;
            if (message.file != null && message.hasOwnProperty("file"))
                object.file = options.bytes === String ? $util.base64.encode(message.file, 0, message.file.length) : options.bytes === Array ? Array.prototype.slice.call(message.file) : message.file;
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                object.fileName = message.fileName;
            if (message.fileSize != null && message.hasOwnProperty("fileSize"))
                object.fileSize = message.fileSize;
            if (message.selfID != null && message.hasOwnProperty("selfID"))
                object.selfID = message.selfID;
            return object;
        };

        /**
         * Converts this Msg to JSON.
         * @function toJSON
         * @memberof pb_msg.Msg
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Msg.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Msg
         * @function getTypeUrl
         * @memberof pb_msg.Msg
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Msg.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb_msg.Msg";
        };

        return Msg;
    })();

    pb_msg.ErrRsp = (function() {

        /**
         * Properties of an ErrRsp.
         * @memberof pb_msg
         * @interface IErrRsp
         * @property {number|null} [errCode] ErrRsp errCode
         * @property {string|null} [errMsg] ErrRsp errMsg
         */

        /**
         * Constructs a new ErrRsp.
         * @memberof pb_msg
         * @classdesc Represents an ErrRsp.
         * @implements IErrRsp
         * @constructor
         * @param {pb_msg.IErrRsp=} [properties] Properties to set
         */
        function ErrRsp(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ErrRsp errCode.
         * @member {number} errCode
         * @memberof pb_msg.ErrRsp
         * @instance
         */
        ErrRsp.prototype.errCode = 0;

        /**
         * ErrRsp errMsg.
         * @member {string} errMsg
         * @memberof pb_msg.ErrRsp
         * @instance
         */
        ErrRsp.prototype.errMsg = "";

        /**
         * Creates a new ErrRsp instance using the specified properties.
         * @function create
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {pb_msg.IErrRsp=} [properties] Properties to set
         * @returns {pb_msg.ErrRsp} ErrRsp instance
         */
        ErrRsp.create = function create(properties) {
            return new ErrRsp(properties);
        };

        /**
         * Encodes the specified ErrRsp message. Does not implicitly {@link pb_msg.ErrRsp.verify|verify} messages.
         * @function encode
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {pb_msg.IErrRsp} message ErrRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrRsp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.errCode != null && Object.hasOwnProperty.call(message, "errCode"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.errCode);
            if (message.errMsg != null && Object.hasOwnProperty.call(message, "errMsg"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.errMsg);
            return writer;
        };

        /**
         * Encodes the specified ErrRsp message, length delimited. Does not implicitly {@link pb_msg.ErrRsp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {pb_msg.IErrRsp} message ErrRsp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ErrRsp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ErrRsp message from the specified reader or buffer.
         * @function decode
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {pb_msg.ErrRsp} ErrRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrRsp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.pb_msg.ErrRsp();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.errCode = reader.int32();
                        break;
                    }
                case 2: {
                        message.errMsg = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ErrRsp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {pb_msg.ErrRsp} ErrRsp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ErrRsp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ErrRsp message.
         * @function verify
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ErrRsp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.errCode != null && message.hasOwnProperty("errCode"))
                if (!$util.isInteger(message.errCode))
                    return "errCode: integer expected";
            if (message.errMsg != null && message.hasOwnProperty("errMsg"))
                if (!$util.isString(message.errMsg))
                    return "errMsg: string expected";
            return null;
        };

        /**
         * Creates an ErrRsp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {pb_msg.ErrRsp} ErrRsp
         */
        ErrRsp.fromObject = function fromObject(object) {
            if (object instanceof $root.pb_msg.ErrRsp)
                return object;
            let message = new $root.pb_msg.ErrRsp();
            if (object.errCode != null)
                message.errCode = object.errCode | 0;
            if (object.errMsg != null)
                message.errMsg = String(object.errMsg);
            return message;
        };

        /**
         * Creates a plain object from an ErrRsp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {pb_msg.ErrRsp} message ErrRsp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ErrRsp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.errCode = 0;
                object.errMsg = "";
            }
            if (message.errCode != null && message.hasOwnProperty("errCode"))
                object.errCode = message.errCode;
            if (message.errMsg != null && message.hasOwnProperty("errMsg"))
                object.errMsg = message.errMsg;
            return object;
        };

        /**
         * Converts this ErrRsp to JSON.
         * @function toJSON
         * @memberof pb_msg.ErrRsp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ErrRsp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ErrRsp
         * @function getTypeUrl
         * @memberof pb_msg.ErrRsp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ErrRsp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/pb_msg.ErrRsp";
        };

        return ErrRsp;
    })();

    pb_msg.MsgServer = (function() {

        /**
         * Constructs a new MsgServer service.
         * @memberof pb_msg
         * @classdesc Represents a MsgServer
         * @extends $protobuf.rpc.Service
         * @constructor
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         */
        function MsgServer(rpcImpl, requestDelimited, responseDelimited) {
            $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
        }

        (MsgServer.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = MsgServer;

        /**
         * Creates new MsgServer service using the specified rpc implementation.
         * @function create
         * @memberof pb_msg.MsgServer
         * @static
         * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
         * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
         * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
         * @returns {MsgServer} RPC service. Useful where requests and/or responses are streamed.
         */
        MsgServer.create = function create(rpcImpl, requestDelimited, responseDelimited) {
            return new this(rpcImpl, requestDelimited, responseDelimited);
        };

        /**
         * Callback as used by {@link pb_msg.MsgServer#push}.
         * @memberof pb_msg.MsgServer
         * @typedef PushCallback
         * @type {function}
         * @param {Error|null} error Error, if any
         * @param {pb_msg.ErrRsp} [response] ErrRsp
         */

        /**
         * Calls Push.
         * @function push
         * @memberof pb_msg.MsgServer
         * @instance
         * @param {pb_msg.IMsg} request Msg message or plain object
         * @param {pb_msg.MsgServer.PushCallback} callback Node-style callback called with the error, if any, and ErrRsp
         * @returns {undefined}
         * @variation 1
         */
        Object.defineProperty(MsgServer.prototype.push = function push(request, callback) {
            return this.rpcCall(push, $root.pb_msg.Msg, $root.pb_msg.ErrRsp, request, callback);
        }, "name", { value: "Push" });

        /**
         * Calls Push.
         * @function push
         * @memberof pb_msg.MsgServer
         * @instance
         * @param {pb_msg.IMsg} request Msg message or plain object
         * @returns {Promise<pb_msg.ErrRsp>} Promise
         * @variation 2
         */

        return MsgServer;
    })();

    return pb_msg;
})();

export { $root as default };
