describe("Basic functions", function() {
  beforeEach(function() {

  });

  describe("the operation of the cat function", function() {
    it("should concatenate two arrays", function() {
      var a = [1,2,3];
      var b = [4,5,6];

      expect(L.cat(a,b)).toEqual([1,2,3,4,5,6]);
    });

    it("should concatenate two items, as long as the first is an array", function() {
      var a = [1];
      var b = 2;

      expect(L.cat(a,b)).toEqual([1,2]);
    });

    it("should concatenate 3 or more arrays", function() {
      var a = [1,2,3];
      var b = [4,5,6];
      var c = [7,8,9];
      var d = [0,0,0];

      expect(L.cat(a,b,c)).toEqual([1,2,3,4,5,6,7,8,9]);
      expect(L.cat(a,b,c,d)).toEqual([1,2,3,4,5,6,7,8,9,0,0,0]);
    });

    it("should concatenate three or more items, as long as the first is an array", function() {
      var a = [1];
      var b = 2;
      var c = 3;
      var d = [4];

      expect(L.cat(a,b,c)).toEqual([1,2,3]);
      expect(L.cat(a,b,c,d)).toEqual([1,2,3,4]);
    });

    it("should throw an exception if the first arg is not an array", function() {
      expect(function() { L.cat(1,2); }).toThrow();
      expect(function() { L.cat(1,[2]); }).toThrow();

    });
  });

  describe("the operation of the pour function", function() {
    it("should pour two arrays", function() {
      var a = [1,2,3];
      var b = [4,5,6];

      expect(L.pour(a,b)).toEqual([1,2,3,4,5,6]);
    });

    it("should pour two items, as long as the first is an array", function() {
      var a = [1];
      var b = 2;

      expect(L.pour(a,b)).toEqual([1,2]);
    });

    it("should pour 3 or more arrays", function() {
      var a = [1,2,3];
      var b = [4,5,6];
      var c = [7,8,9];
      var d = [0,0,0];

      expect(L.pour(a,b,c)).toEqual([1,2,3,4,5,6,7,8,9]);
      expect(L.pour(a,b,c,d)).toEqual([1,2,3,4,5,6,7,8,9,0,0,0]);
    });

    it("should pour three or more items, as long as the first is an array", function() {
      var a = [1];
      var b = 2;
      var c = 3;
      var d = [4];

      expect(L.pour(a,b,c)).toEqual([1,2,3]);
      expect(L.pour(a,b,c,d)).toEqual([1,2,3,4]);
    });

    it("should throw an exception if the first arg is not an array", function() {
      expect(function() { L.pour(1,2); }).toThrow();
      expect(function() { L.pour(1,[2]); }).toThrow();

    });
  });

  describe("the operation of the into function", function() {
    it("should into two arrays", function() {
      var a = [1,2,3];
      var b = [4,5,6];

      expect(L.into(a,b)).toEqual([1,2,3,4,5,6]);
    });

    it("should throw an exception if either arg is not an array", function() {
      expect(function() { L.into(1,2); }).toThrow();
      expect(function() { L.into(1,[2]); }).toThrow();
      expect(function() { L.into(); }).toThrow();
      expect(function() { L.into([]); }).toThrow();
    });
  });

  describe("the operation of the butLast function", function() {
    it("should give all but the last element in an array", function() {
      var a = [1,2,3];

      expect(L.butLast(a)).toEqual([1,2]);
      expect(L.butLast([])).toEqual([]);
    });

    it("should throw an exception if not given an array", function() {
      expect(function() { L.butLast(1); }).toThrow();
    });
  });
});
