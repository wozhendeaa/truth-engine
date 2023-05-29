// Chakra imports
import {
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	useDisclosure,
	useColorModeValue,
	Flex,
	Icon,
	Text
} from '@chakra-ui/react';
import { ChangeEvent, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
// Assets
import { MdOutlinePerson, MdDelete } from 'react-icons/md';
export default function Banner(props: { icon: JSX.Element | string; canDelete : boolean }) {
	const { icon, canDelete, ...rest } = props;

	// Ellipsis modals
	const { isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1 } = useDisclosure();

	// Chakra color mode
	const textColor = useColorModeValue('white', 'secondaryGray.900');
	const textHover = useColorModeValue(
		{ color: 'secondaryGray.600', bg: 'unset' },
		{ color: 'secondaryGray.600', bg: 'unset' }
	);
	const bgList = useColorModeValue('whiteAlpha.100', 'white');
	const bgShadow = useColorModeValue('14px 17px 40px 4px rgba(112, 144, 176, 0.08)', 'unset');
	const {t} = useTranslation();

	return (
		<Menu isOpen={isOpen1} onClose={onClose1}>
			<MenuButton {...rest} onClick={onOpen1}>
				{icon}
			</MenuButton>
			<MenuList
				w='150px'
				minW='unset'
				maxW='150px !important'
				border='transparent'
				backdropFilter='blur(63px)'
				bg={bgList}
				boxShadow={bgShadow}
				borderRadius='20px'
				p='15px'>
				<MenuItem
					transition='0.2s linear'
					bg="transparent"
					color={textColor}
					_hover={textHover}
					p='0px'
					borderRadius='8px'
					_active={{
						bg: 'transparent'
					}}
					_focus={{
						bg: 'transparent'
					}}
					mb='10px'>
					<Flex align='center'>
						<Icon as={MdOutlinePerson} h='16px' w='16px' me='8px' />
						<Text fontSize='sm' fontWeight='400'>
							{t('report')}
						</Text>
					</Flex>
				</MenuItem>
				{
					canDelete && (	<MenuItem
						transition='0.2s linear'
						bg="transparent"
						p='0px'
						borderRadius='8px'
						color={textColor}
						_hover={textHover}
						_active={{
							bg: 'transparent'
						}}
						_focus={{
							bg: 'transparent'
						}}
						mb='10px'>
						<Flex align='center'>
							<Icon as={MdDelete} h='16px' w='16px' me='8px' />
							<Text fontSize='sm' fontWeight='400'>
								{t('delete')}
							</Text>
						</Flex>
					</MenuItem>)
				}
			</MenuList>
		</Menu>
	);
}
