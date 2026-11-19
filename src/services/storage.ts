import AsyncStorage from '@react-native-async-storage/async-storage';
import { PontoColeta } from '../types';

const FAVORITOS_KEY = '@reciclaspot:favoritos';
const FOTO_COMPROVANTE_KEY = '@reciclaspot:comprovante';

export async function carregarFavoritos(): Promise<PontoColeta[]> {
    try {
        const json = await AsyncStorage.getItem(FAVORITOS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Erro ao ler favoritos:', error);
        return [];
    }
}

export async function alternarFavorito(ponto: PontoColeta): Promise<PontoColeta[]> {
    try {
        const atuais = await carregarFavoritos();
        const existe = atuais.some((item) => item.id === ponto.id);

        const atualizados = existe
            ? atuais.filter((item) => item.id !== ponto.id)
            : [...atuais, ponto];

        await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(atualizados));
        return atualizados;
    } catch (error) {
        console.error('Erro ao salvar favorito:', error);
        return [];
    }
}

export async function salvarFotoComprovante(uri: string): Promise<void> {
    try {
        await AsyncStorage.setItem(FOTO_COMPROVANTE_KEY, uri);
    } catch (error) {
        console.error('Erro ao salvar foto:', error);
    }
}

export async function carregarFotoComprovante(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(FOTO_COMPROVANTE_KEY);
    } catch (error) {
        return null;
    }
}
