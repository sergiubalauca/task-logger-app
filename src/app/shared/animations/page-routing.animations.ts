import { AnimationController, Animation } from '@ionic/angular';

export const pageTransitionAnimations = (baseEl: HTMLElement, opts?: any): Animation => {
	const animationCtrl = new AnimationController();
	const DURATION = 200;

	try {
		const rootAnimation = animationCtrl
			.create()
			.addElement(opts.enteringEl)
			.duration(DURATION)
			.iterations(1)
			.easing('ease-in')
			.fromTo('transform', 'translateX(-98vw)', 'translateX(0vw)')
			.fromTo('opacity', '0.05', '1');

		if (opts.direction === 'forward') {
			return animationCtrl
				.create()
				.addElement(opts.enteringEl)
				.duration(DURATION)
				.iterations(1)
				.easing('ease-in')
				.fromTo('transform', 'translateX(90vw)', 'translateY(0vw)')
				.fromTo('opacity', '0.5', '1');
		} else {
			const leavingAnimation = animationCtrl
				.create()
				.addElement(opts.leavingEl)
				.duration(DURATION)
				.iterations(1)
				.onFinish((currentStep: number) => {
					// this is for avoiding flickering on ios swipe left. Display: none is set only when the swipe
					// is completed, not cancelled mid way
					if (currentStep === 1 && leavingAnimation.elements?.length > 0) {
						leavingAnimation.elements[0].style.setProperty('display', 'none');
					}
				})
				.easing('ease-out')
				.fromTo('transform', 'translateX(0vw)', 'translateX(130vw)')
				.fromTo('opacity', '0.75', '0.0');

			return animationCtrl.create().addAnimation([rootAnimation, leavingAnimation]);
		}
	} catch (error) {
		return animationCtrl.create();
	}
};

export const addEditTransitionAnimation = (baseEl: HTMLElement, opts?: any): Animation => {
	const animationCtrl = new AnimationController();
	const DURATION = 400;

	const enteringAnimationBase = animationCtrl
		.create()
		.addElement(opts.enteringEl)
		.duration(DURATION)
		.iterations(1)
		.easing('ease-in');

	const leavingAnimationBase = animationCtrl
		.create()
		.addElement(opts.leavingEl)
		.duration(DURATION)
		.iterations(1)
		.easing('ease-out');

	try {
		if (opts.direction === 'forward') {
			enteringAnimationBase
				.fromTo('transform', 'translateY(50vh)', 'translateY(0vh)')
				.fromTo('opacity', '0.05', '1');

			leavingAnimationBase
				.fromTo('transform', 'translateY(0vh)', 'translateY(-50vh)')
				.fromTo('opacity', '0.75', '0.0');

			return animationCtrl.create().addAnimation([enteringAnimationBase, leavingAnimationBase]);
		} else {
			enteringAnimationBase
				.fromTo('transform', 'translateY(-115vh)', 'translateY(0vh)')
				.fromTo('opacity', '0.05', '1');

			leavingAnimationBase
				.onFinish((currentStep: number) => {
					// this is for avoiding flickering on ios swipe left. Display: none is set only when the swipe
					// is completed, not cancelled mid way
					if (currentStep === 1 && leavingAnimationBase.elements?.length > 0) {
						leavingAnimationBase.elements[0].style.setProperty('display', 'none');
					}
				})
				.easing('ease-out')
				.fromTo('transform', 'translateY(5vh)', 'translateY(100vh)')
				.fromTo('opacity', '0.75', '0.0');

			return animationCtrl.create().addAnimation([enteringAnimationBase, leavingAnimationBase]);
		}
	} catch (error) {
		return animationCtrl.create();
	}
};
