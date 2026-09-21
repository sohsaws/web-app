
import { type MotionValue, type AnimationPlaybackControlsWithThen, animate } from 'motion/react';

export function swipeAway(
    exitDistance: number | null, 
    opacity: MotionValue<number>, 
    x: MotionValue<number>, 
    reducedMotion: boolean | null,
    direction: number | null,
    onComplete: () => void
): AnimationPlaybackControlsWithThen {

    animate(opacity, 0, { duration: reducedMotion ? 0.1 : 0.3 });

    return animate(x, reducedMotion ? x.get() : (direction ? direction : 0) * (exitDistance ? exitDistance : 0), {
        type: 'tween',
        duration: reducedMotion ? 0.1 : 2,
        ease: 'easeOut',
        onComplete: onComplete,
    });
}