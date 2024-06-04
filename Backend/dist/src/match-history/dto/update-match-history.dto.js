"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMatchHistoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_match_history_dto_1 = require("./create-match-history.dto");
class UpdateMatchHistoryDto extends (0, mapped_types_1.PartialType)(create_match_history_dto_1.CreateMatchHistoryDto) {
}
exports.UpdateMatchHistoryDto = UpdateMatchHistoryDto;
//# sourceMappingURL=update-match-history.dto.js.map