import { createSlice } from '@reduxjs/toolkit';

export interface Profile {
  address: string;
  keyManager: string;
  isConnected: boolean;
}

export const profilesSlice = createSlice({
  name: 'PROFILES',
  initialState: [] as Profile[] | [],
  reducers: {
    initProfiles: (state, action) => {
      const profile = {
        ...action.payload,
        isConnected: true
      };

      return [profile];
    },
    addProfile: (state, action) => {
      const profile = action.payload;
      const profiles = state.map(_profile => ({
        ..._profile,
        isConnected: false
      }));
      return [
        ...profiles,
        {
          address: profile.address,
          keyManager: profile.keyManager,
          isConnected: true
        }
      ];
    },
    switchProfile: (state, action) => {
      // action.payload => profile address
      return state.map(profile => {
        if (profile.address === action.payload) {
          return { ...profile, isConnected: true };
        } else {
          return { ...profile, isConnected: false };
        }
      });
    },
    removeProfile: (state, action) => {
      return state
        .filter(profile => profile.address != action.payload)
        .map((profile, index) => {
          if (index === 0) return { ...profile, isConnected: true };
          return profile;
        });
    }
  }
});

export const { initProfiles, addProfile, switchProfile, removeProfile } =
  profilesSlice.actions;

export default profilesSlice.reducer;
