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

    const sql = await getDatabase();
    
    // Check if user has existing save
    const existingSaves = await sql`
      SELECT id FROM game_saves WHERE user_id = ${decoded.userId}
    `;

    if (existingSaves.length > 0) {
      // Update existing save
      await sql`
        UPDATE game_saves 
        SET game_state = ${JSON.stringify(gameState)},
            save_name = ${saveName || 'Sauvegarde auto'},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${decoded.userId}
      `;
    } else {
      // Create new save
      await sql`
        INSERT INTO game_saves (user_id, game_state, save_name)
        VALUES (${decoded.userId}, ${JSON.stringify(gameState)}, ${saveName || 'Sauvegarde auto'})
      `;
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

    const sql = await getDatabase();
    const saves = await sql`
      SELECT game_state, save_name, updated_at 
      FROM game_saves 
      WHERE user_id = ${decoded.userId}
      ORDER BY updated_at DESC 
      LIMIT 1
    `;

    if (saves.length === 0) {
      return NextResponse.json({ success: false, message: 'Aucune sauvegarde trouvée' }, { status: 404 });
    }

    const save = saves[0];

    return NextResponse.json({
      success: true,
      gameState: typeof save.game_state === 'string' ? JSON.parse(save.game_state) : save.game_state,
      saveName: save.save_name,
      updatedAt: save.updated_at
    }, { status: 200 });
  } catch (error) {
    console.error('Load game error:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors du chargement' }, { status: 500 });
  }
}
