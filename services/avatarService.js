// avatarService.js
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export const generateAvatarSvg = (seed, options = {}) => {
    const avatar = createAv
    atar(lorelei, {
        seed: seed, 
        ...options,
    });
    return avatar.toString(); 
};