<?php

return [

    'auth' => [
        'logged_out' => 'Sesión cerrada correctamente.',
        'logged_out_all' => 'Sesión cerrada en todos los dispositivos.',
        'credentials_incorrect' => 'Las credenciales proporcionadas son incorrectas.',
        'password_updated' => 'Contraseña actualizada.',
        'password_incorrect' => 'La contraseña proporcionada es incorrecta.',
        'reset_sent' => 'Si esa dirección tiene una cuenta, le enviaremos un enlace de restablecimiento.',
        'reset_done' => 'Su contraseña ha sido restablecida. Inicie sesión.',
        'verification_sent' => 'Enlace de verificación enviado.',
        'already_verified' => 'Su dirección de correo electrónico ya está verificada.',
    ],

    'store' => [
        'archived' => 'Tienda archivada.',
        'policy_removed' => 'Política eliminada.',
        'policy_needs_body' => 'Una política necesita contenido antes de poder publicarse.',
        'verification_requested' => 'Verificación solicitada. Un administrador la revisará.',
        'already_verified' => 'Esa comprobación ya está verificada.',
        'weekday_once' => 'Cada día de la semana solo puede aparecer una vez.',
        'unknown_setting' => 'Ajuste desconocido: :keys',
    ],

    'member' => [
        'address_added' => 'Dirección :label añadida.',
        'address_updated' => 'Dirección actualizada.',
        'address_removed' => 'Dirección eliminada.',
        'address_default_updated' => 'Dirección predeterminada actualizada.',
    ],

    'admin' => [
        'translations_saved' => 'Traducciones guardadas.',
    ],

    'members' => [
        'cannot_change_own_status' => 'No puedes cambiar el estado de tu propia cuenta.',
        'already_in_status' => 'Esta cuenta ya tiene ese estado.',
        'status_updated' => 'Estado del miembro actualizado.',
        'note_added' => 'Nota añadida.',
    ],

    'vendors' => [
        'cannot_change_own_status' => 'No puedes cambiar el estado de tu propia cuenta de socio.',
        'already_in_status' => 'Este socio ya tiene ese estado.',
        'status_updated' => 'Estado del socio actualizado.',
        'note_added' => 'Nota del socio añadida.',
        'store_status_updated' => 'Estado de la tienda actualizado.',
    ],

    'products' => [
        'already_in_status' => 'Este anuncio ya tiene ese estado.',
        'status_updated' => 'Estado del producto actualizado.',
        'note_added' => 'Nota del producto añadida.',
    ],

    'orders' => [
        'already_in_status' => 'Esta transacción ya tiene ese estado.',
        'status_updated' => 'Estado del pedido actualizado.',
        'note_added' => 'Nota del pedido añadida.',
    ],

    'disputes' => [
        'already_in_status' => 'Esta disputa ya tiene ese estado.',
        'status_updated' => 'Estado de la disputa actualizado.',
        'note_added' => 'Nota de la disputa añadida.',
    ],

    'financials' => [
        'already_in_status' => 'Este movimiento financiero ya tiene ese estado.',
        'status_updated' => 'Estado del movimiento financiero actualizado.',
        'note_added' => 'Nota financiera añadida.',
    ],

    'categories' => [
        'created' => 'Categoría creada.',
        'updated' => 'Categoría actualizada.',
        'invalid_parent' => 'Una categoría no puede anidarse bajo sí misma ni bajo uno de sus descendientes.',
    ],

    'content' => [
        'visibility_updated' => 'Visibilidad del contenido actualizada.',
        'cannot_hide' => 'Este tipo de contenido no se puede ocultar desde esta pantalla.',
    ],

    'ppf' => [
        'settings_updated' => 'Ajustes de la página de tarifas guardados.',
        'tier_created' => 'Nivel de tarifa creado.',
        'tier_updated' => 'Nivel de tarifa actualizado.',
        'tier_deleted' => 'Nivel de tarifa eliminado.',
        'market_created' => 'Mercado de tarifas creado.',
        'market_updated' => 'Mercado de tarifas actualizado.',
        'market_deleted' => 'Mercado de tarifas eliminado.',
        'plan_created' => 'Plan de tarifas creado.',
        'plan_updated' => 'Plan de tarifas actualizado.',
        'plan_deleted' => 'Plan de tarifas eliminado.',
        'faq_created' => 'Pregunta de tarifas creada.',
        'faq_updated' => 'Pregunta de tarifas actualizada.',
        'faq_deleted' => 'Pregunta de tarifas eliminada.',
        'unknown_copy_keys' => 'Claves de texto desconocidas: :keys',
        'invalid_parent' => 'Un mercado no puede anidarse bajo sí mismo ni bajo uno de sus descendientes.',
    ],

    'commissions' => [
        'created' => 'Regla de tarifa PPF creada.',
        'updated' => 'Regla de tarifa PPF actualizada.',
        'already_in_status' => 'Esta regla de tarifa PPF ya tiene ese estado.',
        'status_updated' => 'Estado de la regla de tarifa PPF actualizado.',
        'note_added' => 'Nota de tarifa PPF añadida.',
        'settings_updated' => 'Ajustes de tarifa PPF guardados.',
    ],

    'location' => [
        'region_mismatch' => 'El estado o provincia seleccionado no es válido para ese país.',
    ],

];
