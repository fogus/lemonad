describe("L.range", function () {
  describe("with one argument", function () {
    test("returns nums from 0 inclusive to end exclusive", function () {
      expect(L.range(0)).toEqual([]);
      expect(L.range(1)).toEqual([0]);
      expect(L.range(5)).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe("with two arguments", function () {
    test("returns nums from start inclusive to end exclusive", function () {
      expect(L.range(1, 5)).toEqual([1, 2, 3, 4]);
      expect(L.range(3, 7)).toEqual([3, 4, 5, 6]);
    });

    test("returns an empty array when start equals end", function () {
      expect(L.range(3, 3)).toEqual([]);
      expect(L.range(0, 0)).toEqual([]);
    });

    test("returns an empty array when start is greater than end and step defaults to positive", function () {
      expect(L.range(5, 1)).toEqual([]);
    });
  });

  describe("with three arguments", function () {
    test("uses a positive step", function () {
      expect(L.range(1, 10, 2)).toEqual([1, 3, 5, 7, 9]);
      expect(L.range(0, 10, 3)).toEqual([0, 3, 6, 9]);
    });

    test("uses a negative step", function () {
      expect(L.range(5, 1, -1)).toEqual([5, 4, 3, 2]);
      expect(L.range(10, 0, -3)).toEqual([10, 7, 4, 1]);
    });

    test("returns an empty array when start equals end", function () {
      expect(L.range(3, 3, 1)).toEqual([]);
      expect(L.range(3, 3, -1)).toEqual([]);
    });

    test("returns an empty array when the step moves away from the end", function () {
      expect(L.range(1, 5, -1)).toEqual([]);
      expect(L.range(5, 1, 1)).toEqual([]);
    });

    test("throws when step is 0", function () {
      expect(function () {
        L.range(0, 10, 0);
      }).toThrow();
    });
  });

  describe("fractional values", function () {
    test("supports fractional starts, ends, and steps", function () {
      expect(L.range(0, 1, 0.25)).toEqual([0, 0.25, 0.5, 0.75]);
      expect(L.range(1, 0, -0.25)).toEqual([1, 0.75, 0.5, 0.25]);
    });
  });
});
