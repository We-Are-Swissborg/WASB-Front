import { useAuth } from '@/contexts/AuthContext';
import Role from '@/types/Role';
import { AdminPanelSettingsTwoTone, ExitToAppTwoTone } from '@mui/icons-material';
import { Box, ListItem, ListItemButton, ListItemText, SwipeableDrawer } from '@mui/material';
import { WalletName } from '@solana/wallet-adapter-base';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { Wallet } from '@solana/wallet-adapter-react';
import { WalletIcon } from '@solana/wallet-adapter-react-ui';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export function ConnectButton({ className, ...props }: { className: string }) {
    const { t } = useTranslation('global');
    const { roles } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
        onSelectWallet(walletName: WalletName): void;
        wallets: Wallet[];
    }> | null>(null);

    const { buttonState, onConnect, onDisconnect, onSelectWallet, publicKey, walletIcon, walletName } =
        useWalletMultiButton({
            onSelectWallet: setWalletModalConfig,
        });

    const LABELS = {
        'change-wallet': 'Change wallet',
        connecting: 'Connecting ...',
        'copy-address': 'Copy address',
        copied: 'Copied',
        disconnect: 'Disconnect',
        'has-wallet': 'Connect',
        'no-wallet': 'Select Wallet',
    } as const;

    const content = useMemo(() => {
        if (publicKey) {
            const base58 = publicKey.toBase58();
            return base58.slice(0, 4) + '..' + base58.slice(-4);
        } else if (buttonState === 'connecting' || buttonState === 'has-wallet') {
            return LABELS[buttonState];
        } else {
            return LABELS['no-wallet'];
        }
    }, [buttonState, publicKey]);

    const handleClick = useCallback(() => {
        switch (buttonState) {
            case 'connected':
                setMenuOpen(true);
                break;
            case 'has-wallet':
                if (onConnect) onConnect();
                break;
            case 'no-wallet':
                if (onSelectWallet) {
                    setMenuOpen(true);
                    onSelectWallet();
                }
                break;
        }
    }, [buttonState, onDisconnect, onConnect, onSelectWallet]);

    const toggleDrawer = (newOpen: boolean) => () => {
        setMenuOpen(newOpen);
    };

    return (
        <>
            <button
                {...props}
                className={`${className}`}
                disabled={buttonState === 'connecting' || buttonState === 'disconnecting'}
                onClick={handleClick}
            >
                {walletIcon && walletName && <WalletIcon width={20} wallet={{ adapter: { icon: walletIcon, name: walletName } }} />}{' '}
                {content}
            </button>
            {walletModalConfig ? (
                <SwipeableDrawer
                    anchor="right"
                    open={menuOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <Box sx={{ width: 250 }} role="presentation">
                        {walletModalConfig.wallets.map((wallet) => (
                            <ListItem key={wallet.adapter.name} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        walletModalConfig.onSelectWallet(wallet.adapter.name);
                                        setWalletModalConfig(null);
                                    }}
                                >
                                    <ListItemText primary={wallet.adapter.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </Box>
                </SwipeableDrawer>
            ) : (
                <SwipeableDrawer
                    anchor="right"
                    open={menuOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <Box sx={{ width: 250 }} role="presentation">
                        {roles?.includes(Role.Admin) && (
                            <ListItem key={1} disablePadding>
                                <ListItemButton>
                                    <NavLink to="/admin">
                                        <AdminPanelSettingsTwoTone /> {t('nav.admin')}
                                    </NavLink>
                                </ListItemButton>
                            </ListItem>
                        )}
                        {onDisconnect ? (
                            <ListItem key={2} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        onDisconnect();
                                        setMenuOpen(false);
                                    }}
                                >
                                    <ExitToAppTwoTone />
                                    <ListItemText primary={t('nav.logout')} />
                                </ListItemButton>
                            </ListItem>
                        ) : null}
                    </Box>
                </SwipeableDrawer>
            )}
        </>
    );
}
