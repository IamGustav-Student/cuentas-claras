import { Linking, Share } from "react-native";

// RF-01/RF-03.3.3.1 adaptado a mobile: en vez de la API paga de WhatsApp Business (pensada para el
// backend web original), en la app nativa usamos deep link wa.me y/o el Share sheet del sistema,
// que ya incluye WhatsApp entre las apps disponibles. Ver docs/04-arquitectura.md.

export async function shareSessionLinkViaWhatsApp(sessionUrl: string, sessionName: string) {
  const text = encodeURIComponent(`Sumate a la sesión "${sessionName}" en CuentasClaras: ${sessionUrl}`);
  const waUrl = `https://wa.me/?text=${text}`;

  const canOpen = await Linking.canOpenURL(waUrl);
  if (canOpen) {
    await Linking.openURL(waUrl);
  } else {
    // Fallback: hoja de compartir nativa (funciona sin WhatsApp instalado).
    await Share.share({ message: decodeURIComponent(text) });
  }
}

// CU-04 / RF-16: compartir la pantalla de resultado.
export async function shareResultSummary(summaryText: string) {
  await Share.share({ message: summaryText });
}
