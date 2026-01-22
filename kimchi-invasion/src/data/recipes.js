/**
 * KIMCHI INVASION - Processing Recipes Data
 *
 * @description 가공 건물용 레시피 정의
 * @module data/recipes
 */

/**
 * @typedef {Object} Recipe
 * @property {Object.<string, number>} input - 입력 자원 (자원ID: 수량)
 * @property {Object.<string, number>} output - 출력 자원 (자원ID: 수량)
 * @property {number} time - 가공 시간 (초)
 * @property {string} description - 레시피 설명
 */

/**
 * 가공 레시피 정의
 * 키: 건물 타입 ID
 * @type {Object.<string, Recipe>}
 */
export const RECIPES = {
  furnace: {
    input: { ironOre: 2 }, // 철광석 2개 (GDD: 철광석 → 용광로 → 철판)
    output: { ironPlate: 1 }, // 철판 1개 (가공품)
    time: 15, // 15초 (튜토리얼에서는 3초로 조정)
    description: '철광석 제련',
  },
  brineStation: {
    input: { water: 10 }, // 물 10개
    output: { salt: 1 }, // 소금 1개
    time: 20, // 20초
    description: '소금 증발',
  },
  fermentationVat: {
    input: {
      cabbage: 5, // 배추 5개
      salt: 2, // 소금 2개
      water: 3, // 물 3개
    },
    output: { kimchi: 1 }, // 김치 1개
    time: 60, // 60초 (발효 시간)
    description: '김치 발효',
  },
  waterPurifier: {
    input: { ice: 5 }, // 얼음 5개
    output: { water: 4 }, // 물 4개
    time: 10, // 10초
    description: '얼음 정화',
  },
  greenhouse: {
    input: {
      water: 2,
      energy: 5,
    },
    output: { cabbage: 1 }, // 배추 1개
    time: 30, // 30초
    description: '배추 재배',
  },
}

/**
 * 레시피 조회
 * @param {string} buildingType - 건물 타입
 * @returns {Recipe|null} 레시피 또는 null
 */
export function getRecipe(buildingType) {
  return RECIPES[buildingType] ?? null
}

/**
 * 레시피 존재 여부 확인
 * @param {string} buildingType - 건물 타입
 * @returns {boolean}
 */
export function hasRecipe(buildingType) {
  return buildingType in RECIPES
}

/**
 * 모든 레시피 키 반환
 * @returns {string[]}
 */
export function getRecipeTypes() {
  return Object.keys(RECIPES)
}
