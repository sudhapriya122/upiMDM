'use strict';

describe('MDM.version module', function() {
  beforeEach(module('MDM.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
