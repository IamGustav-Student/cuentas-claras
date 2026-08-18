import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useConnectivityStore } from "@/store/connectivityStore";
import { flushPendingChanges } from "@/services/sync/syncEngine";

// Escucha la conectividad del dispositivo y dispara la sincronización pendiente al recuperar red.
// Nota: agregar "@react-native-community/netinfo" a package.json si no está.
export function useOfflineSync() {
  const setOnline = useConnectivityStore((s) => s.setOnline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected;
      setOnline(online);
      if (online) {
        flushPendingChanges();
      }
    });
    return unsubscribe;
  }, [setOnline]);
}
