import { extendTheme, HTMLChakraProps, ThemingProps } from '@chakra-ui/react';
import { CardComponent } from './additions/card/card';
import { buttonStyles } from './components/button';
import { badgeStyles } from './components/badge';
import { inputStyles } from './components/input';
import { progressStyles } from './components/progress';
import { sliderStyles } from './components/slider';
import { textareaStyles } from './components/textarea';
import { switchStyles } from './components/switch';
import { linkStyles } from './components/link';
import { breakpoints } from './foundations/breakpoints';
import { globalStyles } from './styles';
import {type ThemeConfig } from '@chakra-ui/react'
import tailwindColors from "tailwindcss/colors"


// 2. Add your color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
	colors: {
	...tailwindColors,
	  te_dark_bg: {
		7: tailwindColors.gray[700],
	  },
	  te_dark_text: {
		1: tailwindColors.slate[50],
	  },
	  te_dark_action: {
		4: tailwindColors.lime[400],
	}
	},
  })
  

// 3. extend the theme


export default extendTheme(
	{ breakpoints }, // Breakpoints
	theme,
	config,
	globalStyles,
	badgeStyles, // badge styles
	buttonStyles, // button styles
	linkStyles, // link styles
	progressStyles, // progress styles
	sliderStyles, // slider styles
	inputStyles, // input styles
	textareaStyles, // textarea styles
	switchStyles, // switch styles
	CardComponent // card component
);

export interface CustomCardProps extends HTMLChakraProps<'div'>, ThemingProps {}


