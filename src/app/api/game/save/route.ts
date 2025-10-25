import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDatabase } from '@/lib/database';

// Save game
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();
    const { gameState, saveName } = body;

    const db = getDatabase();
    
    // Check if user has existing save
    const existingSave = db.prepare('SELECT id FROM game_saves WHERE user_id = ?').get(decoded.userId) as any;

    if (existingSave) {
      // Update existing save
      db.prepare(
        'UPDATE game_saves SET game_state = ?, save_name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?'
      ).run(JSON.stringify(gameState), saveName || 'Sauvegarde auto', decoded.userId);
    } else {
      // Create new save
      db.prepare(
        'INSERT INTO game_saves (user_id, game_state, save_name) VALUES (?, ?, ?)'
      ).run(decoded.userId, JSON.stringify(gameState), saveName || 'Sauvegarde auto');
    }

    return NextResponse.json({ success: true, message: 'Partie sauvegardée' }, { status: 200 });
  } catch (error) {
    console.error('Save game error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }
}

// Load game
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'Non authentifié' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Token invalide' }, { status: 401 });
    }

    const db = getDatabase();
    const save = db.prepare(
      'SELECT game_state, save_name, updated_at FROM game_saves WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1'
    ).get(decoded.userId) as any;

    if (!save) {
      return NextResponse.json({ success: false, message: 'Aucune sauvegarde trouvée' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      gameState: JSON.parse(save.game_state),
      saveName: save.save_name,
      updatedAt: save.updated_at
    }, { status: 200 });
  } catch (error) {
    console.error('Load game error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors du chargement' }, { status: 500 });
  }
}
