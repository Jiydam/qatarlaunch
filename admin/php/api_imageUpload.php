<?php 



if ( !empty( $_FILES ) ) {
	//print_r($_FILES); //uncomment to see file array

    //get the temp location
    $tempPath = $_FILES[ 'myFile' ][ 'tmp_name' ];

    //get the filename
    $filename = $_FILES['myFile']['name'];

    // create a unique tag for the filename
    $tag = time() . rand();

    // get the file extension
    $ext = pathinfo($_FILES['myFile']['name'], PATHINFO_EXTENSION);

    // get the base filename
    $basename = pathinfo($_FILES['myFile']['name'], PATHINFO_FILENAME);

    // create a new filename incorporating the unique tag
    $new_filename = $basename . "-" . $tag . "." . $ext;
    
    
    //echo("Base name : ".$basename ."\n");
   
    //echo("Extension : ".$ext ."\n");
  
    


    //echo ("target file2 ".$targetFile."\n");

    process_image($new_filename,$tempPath,$new_filename, $ext);

    //move_uploaded_file( $tempPath, $upload_path.$filename );



} else {

    echo 'No files';

}


function process_image($new_filename, $tempFile,$new_name, $ext){
    ini_set('max_execution_time', 700);

    $upload_img_thumb = $_SERVER['DOCUMENT_ROOT']."/images/portfolio/img_thumb/";
    $upload_img_large = $_SERVER['DOCUMENT_ROOT']."/images/portfolio/img_large/";

    //$root = $_SERVER['DOCUMENT_ROOT'];
    //$uploadDir_images_md = $upload_path;
    //$uploadDir_images_std = $root.'/resources/crm_images/listing_images/images_std/';
    //$uploadDir_thumbs_sm = $root.'/resources/crm_images/listing_images/thumbs_sm/';
    //$uploadDir_thumbs_std = $root.'/resources/crm_images/listing_images/thumbs_std/';
    
    

 

    switch ( $ext )
            {
                case 'jpg' || 'jpeg':
                        $i = imagecreatefromjpeg($tempFile);

                        $img_thumb = thumbnail_box($i, 700,700 );
                        imagejpeg($img_thumb, $upload_img_thumb.$new_name, 100);

                        $img_large = large_img($i, $tempFile);
                        imagejpeg($img_large, $upload_img_large.$new_name, 100);

                        break;
                case 'jpeg':
                        $i = imagecreatefromjpeg($tempFile);

                        $img_thumb = thumbnail_box($i, 700,700 );
                        imagejpeg($img_thumb, $upload_img_thumb.$new_name, 100);

                        $img_large = large_img($i, $tempFile);
                        imagejpeg($img_large, $upload_img_large.$new_name, 100);

                        break;
                case 'png':
                        $i = imagecreatefrompng($tempFile);
                        
                        $img_thumb = thumbnail_box($i, 700,700 );
                        imagepng($img_thumb, $upload_img_thumb.$new_name);

                        $img_large = large_img($i, $tempFile);
                        imagepng($img_large, $upload_img_large.$new_name);

                        break;
                
                 default:
            }



    //$images_std = thumbnail_box($i, 670,442 );
    //imagejpeg($images_std, $uploadDir_images_std.$new_name);

    //$thumbs_sm = thumbnail_box($i, 80,54 );
    //imagejpeg($thumbs_sm, $uploadDir_thumbs_sm.$new_name);

    //$thumbs_std = thumbnail_box($i, 196,127 );
    //imagejpeg($thumbs_std, $uploadDir_thumbs_std.$new_name);
    
    $answer = array( 'filename' => $new_name, 'original_filename'=>$_FILES['myFile']['name']);
    $json = json_encode( $answer );
    echo $json;

    imagedestroy($i);
        
    //move_uploaded_file($tempFile, $targetFile);
    //move_uploaded_file( $tempPath, $upload_path.$filename );
    

}



    function large_img($img, $tempFile) {

        //get the dimenseion of the original image into $file_info array
        $array_img_info = getimagesize($tempFile);
        //print_r($array_img_info);//uncomment to see contents of $array_img_info
        $width = $array_img_info[0];
        $height = $array_img_info[1];

        
        
        if($width>$height){
            //Landscape
            $maxsize = 1600;
            //set max height of landscape image to 800
            if($width<$maxsize){
                $maxsize=$width;
            }
        }else{
            //portrait or square 
            //set max height of portrait image to 800
            $maxsize=800;
            if($height<800){
                $maxsize=$height;
            } 
        }
    


        //get height and width of original image
        $width = $array_img_info[0];
        $height = $array_img_info[1];

        //calculate aspect ratios
        $widthRatio = $maxsize / $width;
        $heightRatio = $maxsize / $height;


        //set apsect ratios
        if (($widthRatio * $height) < $maxsize)
        {
            //echo("image is Landscape");
            //image is landscape

            $thumbHeight = ceil($widthRatio * $height);
            $thumbWidth = $maxsize;
        }else{
            //echo("image is Portrait");
            //image is vertical
            $thumbWidth = ceil($heightRatio * $width);
            $thumbHeight = $maxsize;
        }


        // create holding image
        $thumbnail = imagecreatetruecolor($thumbWidth, $thumbHeight);

        //copy sampled image into thumbnail
        imagecopyresampled($thumbnail, $img, 0,0,0,0,$thumbWidth, $thumbHeight, $width, $height);

        if(!imagecopyresampled($thumbnail, $img,
            0, 0, //dest x, y (margins)
            0, 0, //src x, y (0,0 means top left)
            $thumbWidth, $thumbHeight,//dest w, h (resample to this size (computed above)
            $width, $height )//src w, h (the full size of the original)
         ){
            //copy failed
            imagedestroy($thumbnail);
            return null;
    }
    //copy successful
    return $thumbnail;

	       
	}





    function thumbnail_box($img, $box_w, $box_h) {
    //create the image, of the required size
    $new = imagecreatetruecolor($box_w, $box_h);
    if($new === false) {
        //creation failed -- probably not enough memory
        return null;
        echo("creation failed");
    }


    //Fill the image with a light grey color
    //(this will be visible in the padding around the image,
    //if the aspect ratios of the image and the thumbnail do not match)
    //Replace this with any color you want, or comment it out for black.
    //I used grey for testing =)
    $fill = imagecolorallocate($new, 255, 255, 255);
    imagefill($new, 0, 0, $fill);

    //compute resize ratio
    $hratio = $box_h / imagesy($img);
    $wratio = $box_w / imagesx($img);
    $ratio = max($hratio, $wratio);

    //if the source is smaller than the thumbnail size, 
    //don't resize -- add a margin instead
    //(that is, dont magnify images)
    if($ratio > 1.0){
        //$ratio = 1.0;
    }

    //compute sizes
    $sx = floor(imagesx($img) * $ratio);//floor(imagesy($img) * $ratio);
    $sy = floor(imagesy($img) * $ratio);

    //compute margins
    //Using these margins centers the image in the thumbnail.
    //If you always want the image to the top left, 
    //set both of these to 0
    $m_y = floor(($box_h - $sy) / 2);
    $m_x = floor(($box_w - $sx) / 2);

    //Copy the image data, and resample
    //
    //If you want a fast and ugly thumbnail,
    //replace imagecopyresampled with imagecopyresized

    if(!imagecopyresampled($new, $img,
        $m_x, $m_y, //dest x, y (margins)
        0, 0, //src x, y (0,0 means top left)
        $sx, $sy,//dest w, h (resample to this size (computed above)
        imagesx($img), imagesy($img)) //src w, h (the full size of the original)
    ) {
        //copy failed
        imagedestroy($new);
        return null;
    }
    //copy successful
    return $new;
    
    }



?>