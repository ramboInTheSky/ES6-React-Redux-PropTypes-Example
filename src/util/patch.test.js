import { getPatchInfo, sortPatchList } from './patch';
import { avatarsApi } from '../constants/tokens';

describe('patch', () => {
  describe('getPatchInfo', () => {
    let result;

    describe('Given a profile', () => {
      let profile;

      beforeEach(() => {
        profile = {
          fullname: 'Amorita Holly',
          id: '123456',
          patchName: 'CABBAGE',
        };
        result = getPatchInfo(profile);
      });

      it('should get the patch info', () => {
        expect(result).toEqual({
          name: profile.fullname,
          fullname: profile.fullname,
          patchName: profile.patchName,
          src: avatarsApi,
        });
      });
    });
  });

  describe('sortPatchList', () => {
    it('should sort patches using profile', () => {
      const profile = {
        patchName: 'ABC',
      };

      const patches = [
        {
          patchName: 'DEF',
        },
        {
          patchName: 'ABC123',
        },
        {
          patchName: 'ABC',
        },
        {
          patchName: 'SOMEOTHER',
        },
      ];

      sortPatchList(patches, profile);
      expect(patches).toEqual([
        {
          patchName: 'ABC',
        },
        {
          patchName: 'DEF',
        },
        {
          patchName: 'ABC123',
        },
        {
          patchName: 'SOMEOTHER',
        },
      ]);
    });
  });
});
