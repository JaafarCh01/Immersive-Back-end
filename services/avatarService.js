// avatarService.js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export const generateAvatarSvg = (seed, options = {}) => {
    const avatar = createAvatar(lorelei, {
        seed: seed, 
        ...options,
    });
    return avatar.toString(); 
};
