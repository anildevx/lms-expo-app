import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { logger } from '../utils/logger';

/**
 * Hook to monitor network connectivity status
 */
export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then(handleNetworkChange);

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleNetworkChange = (state: NetInfoState) => {
    const connected = state.isConnected ?? false;
    const reachable = state.isInternetReachable ?? false;

    setIsConnected(connected);
    setIsInternetReachable(reachable);
    setConnectionType(state.type);

    logger.info('Network status changed', {
      isConnected: connected,
      isInternetReachable: reachable,
      type: state.type,
    });
  };

  return {
    isConnected,
    isInternetReachable,
    connectionType,
    isOffline: !isConnected || !isInternetReachable,
  };
};
