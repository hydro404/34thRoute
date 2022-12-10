<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

  <script type="module" src="./auth.js"></script>
  <script type="module" src="./querries.js"></script>
</head>
<body>
    <?php

    $stats = "paid";
    $userId = "fS28aLqGp8XhGq9alCiZUtf7izw2";
    $source = "src_dL7shjCAWXHCqAUtU68vi2uY";
    
    echo "<script type='module'>updateTransaction('$userId','$source','$stats')</script>";
    ?>

</body>
</html>